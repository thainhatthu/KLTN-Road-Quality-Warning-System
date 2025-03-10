# Introduction
The PostgreSQL is run by Docker Compose. It consists of two components: a PostgreSQL database server and a PgBouncer connection pooler. The PostgreSQL database server stores the database, while PgBouncer optimizes performance and resource usage by pooling database connections.
# How to set up
## Repairing 1 file .env follow format below:
``` 
POSTGRES_USER=<user_admin>
POSTGRES_PASSWORD=<password_user_admin>
POSTGRES_USER_DEV=<user_dev>
POSTGRES_PASSWORD_DEV=<password_user_dev>
POSTGRES_DB=roadvision_classifier
```
Replacing the variable with a consistent value

| **Variables**         | **Descriptions**                                                                      |
|-----------------------|---------------------------------------------------------------------------------------|
| POSTGRES_USER         | The username for the administrative user, and this user can only log in the container |
| POSTGRES_PASSWORD     | The password of the administrative user                                               |
| POSTGRES_PASSWORD_DEV | The username of dev user, this user can login from inside                             |
| POSTGRES_DB           | The password of the dev user                                                          |
| POSTGRES_DB           | The name of Database                                                                  |

## Set up access user
To grant the dev user database access, we need to add this user to the pgbouncer/userlist.txt file. The format for user entries is "< username >" "< password >", where the password is a double MD5 hash of the password concatenated with the username (md5 + md5(password || username)). Example: ` "dev" "md5ea85d1d0f93a9cab4fe7ebd5067b61f7" `
## How to run database
To run database execute comand  
` docker compose up -d `
