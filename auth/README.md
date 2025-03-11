# AUTH SERVICE

this service is responsible for
---
creating  users
authenticating and authorizing users
restriction of users (if needed) 
---
the user object contains two properties,
User: {
    username: string
    email: string; must be a valid email
    password: string -> must be atleat 8characters long
}

bad requests return errors with appropriate status code and an error object with the form

{ errors: Err[] }

where Err is an object with the form
{
---
    message: string -> reason for the error
---
    field: string -> optional, the value that caused the error
}


* Endpoints
METHOD   | route                | body                  |   response.json()  | response.statusCode
---
POST     | /api/users/register  | { name: "<yourname>", email: "<youremail.com>", password: "<yourpassword.>"}   | {message: "User created successfully",
username: <yourname> }

