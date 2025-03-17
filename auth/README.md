# AUTH SERVICE

This service is responsible for


* Creating  users


* Authenticating and authorizing users


* Restriction of users (if needed) 

The user object contains three properties
--- 

```
User: {

    username: string

    email: string; must be a valid email
    
    password: string -> must be atleat 8characters long
} 
```

bad requests return errors with appropriate status code and an error object with the form

{ errors: Err[] }

where Err is an object with the form
---
```
{

    message: string -> reason for the error
    status: 'failed'
    field: string -> optional, the value that caused the error
}
```


## Endpoints


* POST /api/users/register

req.body
```
{

    username: "<yourname>",
    email: "<youremail.com>",

    password: "<yourpassword.>"

}
```

res.json
```
{
    message: "User created successfully",
    status: 'succes'
    username: <yourname>
}
```

* POST /api/users/login

req.body
```
{
    email: "youremailQ@gmail.com",
    password: "your password"
}
```

res.json
```
{
    status: 'success',
    
    message: 'user successfully logged in',
    
    object: user
}
```

* GET /api/users/getUser

---
if user islogged in

res.json
```
{
    status: 'success',
    message: 'current user',
    object: user object
}
```
if user is not logged in

res.json
```
{
    status: 'success',
    message: 'current user',
    object: null
}
```

* POST api/users/logout

res.json
```
{
    status: 'success',
    message: "Logged out",
    object: {}
}
```
