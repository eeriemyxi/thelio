import { Hono } from "@hono/hono";
import type { FC } from "@hono/hono/jsx";
import { serveStatic } from '@hono/hono/deno'

import constants from "./constants.ts";
import "jsr:@std/dotenv/load";

const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }))

const Layout: FC = (props) => {
    return (
        <html>
            <head>
                <link rel="stylesheet" href="/static/css/styles.css"/>
            </head>
            <body>{props.children}</body>
        </html>
    );
};

function helper_obj_to_text(obj: object) {
    let text = "";
    Object.entries(obj).forEach((item) => {
        text = text + " " + item[1];
    });
    return text;
}

const Submissions: FC<{ submissions: Deno.KvListIterator<any> }> = async (props: {
    submissions: Deno.KvListIterator<any>;
}) => {
    const submissions_text = [];
    for await (const subm of props.submissions) {
        submissions_text.push(helper_obj_to_text(subm.value));
    }

    return (
        <Layout>
            <h1>Submissions</h1>
            <ul>
                {submissions_text.map((submission) => {
                    return <li>{submission}</li>;
                })}
            </ul>
        </Layout>
    );
};

app.get("/", async (c) => {
    const kv = await Deno.openKv(constants.KV_CONNECT_URL);
    const submissions = kv.list({ prefix: ["submissions"] });

    return c.html(
        <Layout>
            <Submissions submissions={submissions} />
            <form class="href-buttons">
                <button formaction="/submit" style="margin-right:10px;">
                    Submit your script
                </button>
                <button formaction="/report">Report a script</button>
            </form>
        </Layout>,
    );
});

app
    .get("/submit", async (c) => {
        return c.html(
            <Layout>
                <h1>Submit Your Script</h1>
                <form action="/submit" method="post">
                    <label>Title:</label>
                    <br />
                    <input id="title" name="title" type="text"></input>
                    <br />
                    <label>Description:</label>
                    <br />
                    <input id="description" name="description" type="text">
                    </input>
                    <br />
                    <br />
                    <input type="submit" value="Submit Script"></input>
                </form>
            </Layout>,
        );
    })
    .post("/submit", async (c) => {
        const form = await c.req.formData();
        const submit_id = crypto.randomUUID();
        const kv = await Deno.openKv(constants.KV_CONNECT_URL);

        try {
            kv.set(["submissions", submit_id], {
                title: form.get("title"),
                desc: form.get("description"),
                submit_id: submit_id,
            });
        } catch (err) {
            c.status(500);
            return c.body(
                `Your submission couldn't be placed due to an error in the database. Error: ${err}.`,
            );
        }

        c.status(200);
        return c.body(
            `Your submission has been added.\nSubmission ID: ${submit_id}.`,
        );
    });

async function handle_report(form: FormData, report_id: string) {
    // to be implemented
    console.log(
        `Report handler has been called for submission with ID ${
            form.get("submit_id")
        }.`,
    );
}

app
    .get("/report", async (c) => {
        return c.html(
            <Layout>
                <h1>Report A Script</h1>
                <form action="/report" method="post">
                    <label>Submission ID:</label>
                    <br />
                    <input id="submit_id" name="submit_id" type="text"></input>
                    <br />
                    <label>Reason:</label>
                    <br />
                    <input id="reason" name="reason" type="text"></input>
                    <br />
                    <br />
                    <input type="submit" value="Submit Report"></input>
                </form>
            </Layout>,
        );
    })
    .post("/report", async (c) => {
        const form = await c.req.formData();
        const report_id = crypto.randomUUID();
        const kv = await Deno.openKv(constants.KV_CONNECT_URL);
        let submit_id: FormDataEntryValue | null = form.get("submit_id");

        if (submit_id === null) {
            c.status(400);
            return c.body("Submission ID is missing.");
        }
        submit_id = submit_id.toString().trim();

        form.set("submit_id", submit_id);

        if ((await kv.get(["submissions", submit_id])).value === null) {
            c.status(400);
            return c.body(`Provided submission ID ${submit_id} doesn't exist.`);
        }

        try {
            kv.set(["reports", report_id], {
                submit_id: submit_id,
                reason: form.get("reason"),
                report_id: report_id,
            });
        } catch (err) {
            c.status(500);
            return c.body(
                `Your report has been denied due to an error in the database. Error: ${err}.`,
            );
        }

        await handle_report(form, report_id);

        c.status(200);
        return c.body(
            `Your report has been sent to the moderators.\nReport ID: ${report_id}.`,
        );
    });

Deno.serve({ port: 8080 }, app.fetch);
