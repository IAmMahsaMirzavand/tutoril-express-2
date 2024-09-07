const express = require('express');
const { request } = require('http');

const app = express()

app.use(express.json())


const loggingMiddleware = (request,response,next) => {

    console.log(`${request.method} - ${request.url}`);
    next();
}


const resolveIndexByUserId = (request,response,next) => {

    const { body , 
    params : {id} ,
} = request

const parsedId = parseInt(id)
if(isNaN(parsedId)) return response.sendStatus(400);

const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
if(findUserIndex === -1) return response.sendStatus(404);

request.findUserIndex = findUserIndex;

next();
}
// app.use(loggingMiddleware)
const PORT = process.env.PORT || 3005;


 const mockUsers = [
	{ id: 1, username: "anson", displayName: "Anson", password: "hello123" },
	{ id: 2, username: "jack", displayName: "Jack", password: "hello124" },
	{ id: 3, username: "adam", displayName: "Adam", password: "hellohello" },
	{ id: 4, username: "tina", displayName: "Tina", password: "test123" },
	{ id: 5, username: "jason", displayName: "Jason", password: "hello123" },
	{ id: 6, username: "henry", displayName: "Henry", password: "hello123" },
	{ id: 7, username: "marilyn", displayName: "Marilyn", password: "hello123" },
];




 /////app.get('/' , loggingMiddleware, (request,response))

// app.get('/' ,(request,response,next) => {

//     console.log('Base Url 1');
//     next();
// } ,(request,response,next) => {

//     console.log('Base Url 2');
//     next();
// } ,(request,response,next) => {

//     console.log('Base Url 3');
//     next();
// } 
// ,(request,response) => {

//     response.status(201).send({msg : 'Hello'})
// })



app.get('/' , (request,response) => {

        response.status(201).send({msg : 'Hello'})
    })


app.get('/api/users' , (request,response) => {

   console.log(request.query);
   const { query : {filter,value} ,} = request

   if(filter && value) 

    return response.send(mockUsers.filter((user) => user[filter].includes(value))
    );
   
    return response.send(mockUsers)
   
})


app.post('/api/users' , (request,response) => {

    const { body } = request;
    const newUser = { id : mockUsers[mockUsers.length - 1].id + 1 , ...body};
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
})



 app.get("/api/users/:id", resolveIndexByUserId , (request,response) => {

    const {findUserIndex} = request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) return response.sendStatus(404);
    return response.send(findUser);

 });


 
 app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
     const { body, findUserIndex } = request;
     mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
     return response.sendStatus(200);
 });
 
 app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
     const { body, findUserIndex } = request;
     mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
     return response.sendStatus(200);
 });


 app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
	const { findUserIndex } = request;
	mockUsers.splice(findUserIndex, 1);
	return response.sendStatus(200);
});
 
// app.use(loggingMiddleware , (request,response,next) => {

//     console.log('Finished Logging...');
    // next();
// });

app.listen(PORT , () => {

    console.log(`SERVER RUNNING ON PORT ${PORT}`);
})