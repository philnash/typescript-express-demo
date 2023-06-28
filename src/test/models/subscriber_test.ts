import { describe, it, mock } from "node:test";
import { strict as assert } from "node:assert/strict";
import { Subscriber } from "../../models/subscriber.js";
import { Database } from "sqlite3";

const rawSubscriber = {
  id: 1,
  email: "valid@example.com",
};

const exampleSubscribers = [new Subscriber(rawSubscriber)];

describe("Subscriber", () => {
  it("fetches all subscribers from the database", async () => {
    const all = mock.fn((_, callback) => {
      callback(null, [rawSubscriber]);
    });
    const db = { all } as unknown as Database;
    const subscribers = await Subscriber.getAll(db);
    assert.equal(all.mock.calls.length, 1);
    assert.deepEqual(subscribers, exampleSubscribers);
  });
});
