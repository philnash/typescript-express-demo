import { Database } from "sqlite3";

interface SubscriberData {
  id: number;
  email: string;
}

type Result = { success: false; message: string } | { success: true };

export class Subscriber implements SubscriberData {
  id: number;
  email: string;

  constructor({ id, email }: SubscriberData) {
    this.id = id;
    this.email = email;
  }

  static async save(db: Database, email: string) {
    return new Promise<Result>((resolve, reject) => {
      const wrongMatch = RegExp(/^(a+)+$ /).exec(email);
      console.log(wrongMatch);
      const match = RegExp(/^(.*)@(.*?\.)+([a-z]{2,18})$/).exec(email);
      if (match) {
        db.run(
          "INSERT INTO SUBSCRIBERS (email) VALUES (?);",
          [email],
          function (error) {
            if (error) {
              console.error(error);
              reject({
                success: false,
                message:
                  "There was an issue saving your email address, please try again later.",
              });
            } else {
              resolve({ success: true });
            }
          }
        );
      } else {
        resolve({
          success: false,
          message: "Please provide a valid email address",
        });
      }
    });
  }

  static getAll(db: Database) {
    return new Promise<Subscriber[]>((resolve, reject) => {
      db.all("SELECT * FROM SUBSCRIBERS;", (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            rows.map((row) => {
              const subscriberData: SubscriberData = row as SubscriberData;
              return new Subscriber(subscriberData);
            })
          );
        }
      });
    });
  }
}
