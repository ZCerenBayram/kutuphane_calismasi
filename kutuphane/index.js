const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./Db");
const portNumber = 3000;

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.get("/", (request, response) => {
	response.json({
		Bilgi: "Kütüphane sistemi.",
		
	});
});



app.get("/users", db.getUsers);
app.get("/users/:username", db.getUsersByUsername);
app.post("/users", db.insertUsers);
app.put("/users/:username", db.UserUpdate);
app.delete("/users/:username", db.UserDelete);

app.get("/books", db.getBooks);
app.get("/books/:isbn", db.getBooksByIsbn);
app.post("/books", db.insertBooks);
app.put("/books/:isbn", db.BookUpdate);
app.delete("/books/:isbn", db.BookDelete);

app.get("/borrowbooks", db.getBorrowBooks);
app.post("/borrowbooks/:username", db.BorrowBooksByUsername);
app.delete("/borrowbooks/:isbn", db.BorrowBooksDeleteByIsbn);

app.get("/fetchbooks/:isbn", db.getFetchBooks);

app.listen(portNumber, () => {
	console.log(`Uygulama çalışıyor. Port Numarası: ${portNumber}`);
});