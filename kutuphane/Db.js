const bigData = require('pg').Pool;
const BigData = new bigData({
    user: 'postgres',
    host: 'localhost',
    database: 'kutuphane',
    password: '123',
    port: 5432,
});

// USERS TABLE
const getUsers = (request, response) => {
    BigData.query('SELECT * FROM users ORDER BY name ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getUsersByUsername = (request, response) => {
    const username = request.params.username;

    BigData.query("SELECT * FROM users WHERE username = $1 ", [username], (error, results) => {
        if (error) {
            throw error;
        }
        if(results.rowCount>0) {
            response.status(200).json(results.rows);
            
          }
          else
          {
            
            response.send({message:"Kayıt bulunamadı!"});
          }
    });
};

const insertUsers = (request, response) => {
    const {
        username,
        name,
        surname,
        Email,
        Pwd
    } = request.body;

    
    
    BigData.query("SELECT * FROM users WHERE username = $1 ", [username], (error, results) => {
        if (error) {
            throw error;
        }
        if(results.rowCount>0) {
            
            response.send({message:"Kayıt bulundu!"});
                  
        }else{
            
            BigData.query('INSERT INTO users (username, name,surname, Email,Pwd) VALUES($1, $2, $3, $4, $5)', [username, name,surname, Email,Pwd])
            .then(res => {
                response.status(201).send(res);
            })
            .catch(e => console.error(e.stack));
            response.send({message:"Kayıt eklendi!"});
        }
    });


};

const UserUpdate = (request, response) => {
    const username = request.params.username;
    const {
        name,
        surname,
        Pwd
    } = request.body;

    BigData.query(
        'UPDATE users SET name = $1, surname = $2, Pwd = $3 WHERE username = $4',
        [name, surname, Pwd, username],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`Kullunici güncellendi, username : ${username}`);
        }
    );
};

const UserDelete = (request, response) => {
    const username = request.params.username;

    BigData.query('DELETE FROM users WHERE username = $1', [username], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Kullanıcı kaydı silindi, username: ${username}`);
    });
};


// BOOKS TABLE
const getBooks = (request, response) => {
    BigData.query('SELECT * FROM books ORDER BY name ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getBooksByIsbn = (request, response) => {
    const isbn = request.params.isbn;

    BigData.query("SELECT * FROM books WHERE isbn = $1 ", [isbn], (error, results) => {
        if (error) {
            throw error;
        }
        if(results.rowCount>0) {
            response.status(200).json(results.rows);
            
          }
          else
          {
            
            response.send({message:"Kayıt bulunamadı!"});
          }
    });
};

const insertBooks = (request, response) => {
    const {
        isbn,
        name,
        writer,
        category
    } = request.body;

    
    
    BigData.query("SELECT * FROM books WHERE isbn = $1 ", [isbn], (error, results) => {
        if (error) {
            throw error;
        }
        if(results.rowCount>0) {
            
            response.send({message:"Kayıt bulundu!"});
                  
        }else{
            
            BigData.query('INSERT INTO books (isbn, name,writer,category) VALUES($1, $2, $3, $4)', [isbn, name,writer, category])
            .then(res => {
                response.status(201).send(res);
            })
            .catch(e => console.error(e.stack));
            response.send({message:"Kayıt eklendi!"});
        }
    });


};

const BookUpdate = (request, response) => {
    const isbn = request.params.isbn;
    const {
        name,
        writer,
        category
    } = request.body;

    BigData.query(
        'UPDATE books SET name = $1, writer = $2, category = $3 WHERE isbn = $4',
        [name, writer, category, isbn],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`Kitap güncellendi, isbn : ${isbn}`);
        }
    );
};

const BookDelete = (request, response) => {
    const isbn = request.params.isbn;

    BigData.query('DELETE FROM books WHERE isbn = $1', [isbn], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Kitap silindi, isbn: ${isbn}`);
    });
};

//BORROW BOOKS

const getBorrowBooks = (request, response) => {
    BigData.query('SELECT * FROM borrow_books ORDER BY username ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const BorrowBooksByUsername = (request, response) => {
    const username = request.params.username;
    const {
        isbn
    } = request.body;

    
    
    BigData.query("SELECT * FROM borrow_books WHERE isbn = $1 ", [isbn], (error, results) => {
        if (error) {
            throw error;
        }
        if(results.rowCount>0) {
            
            response.send({message:"Kitap ödünç verilmiş!"});
                  
        }else{
            
            BigData.query('INSERT INTO borrow_books (isbn, username) VALUES($1, $2)', [isbn, username])
            .then(res => {
                response.status(201).send(res);
            })
            .catch(e => console.error(e.stack));
            response.send({message:"Kayıt eklendi!"});
        }
    });


};

const BorrowBooksDeleteByIsbn = (request, response) => {
    const isbn = request.params.isbn;

    BigData.query('DELETE FROM borrow_books WHERE isbn = $1', [isbn], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Ödünç kaydı silindi, isbn: ${isbn}`);
    });
};

//GET BOOKS FROM EXTERNAL SOURCE
const getFetchBooks = (request, response) => {
    const isbn = request.params.isbn;
    
    const fetch = require('node-fetch');

        fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`)
            .then(res => res.json())
            .then(json => {
                var name="", writer="", category="";
                
                name=json[`ISBN:${isbn}`].title;
                writer=json[`ISBN:${isbn}`].authors[0].name;
                category=json[`ISBN:${isbn}`].publish_date;
                    
                //response.send({message:`${isbn} ${name} ${writer} ${category} `});
                
                BigData.query("SELECT * FROM books WHERE isbn = $1 ", [isbn], (error, results) => {
                    if (error) {
                        throw error;
                    }
                    if(results.rowCount>0) {
                        
                        response.send({message:"Kayıt bulundu!"});
                                
                    }else{
                        
                        BigData.query('INSERT INTO books (isbn, name,writer,category) VALUES($1, $2, $3, $4)', [isbn, name,writer, category])
                        .then(res => {
                            response.status(201).send(res);
                        })
                        .catch(e => console.error(e.stack));
                        response.send({message:"Kayıt eklendi!"});
                    }
                });
                
            }) 
        }




module.exports = {
    getUsers,
    getUsersByUsername,
    insertUsers,
    UserUpdate,
    UserDelete,
    getBooks,
    getBooksByIsbn,
    insertBooks,
    BookUpdate,
    BookDelete,
    BorrowBooksByUsername,
    BorrowBooksDeleteByIsbn,
    getBorrowBooks,
    getFetchBooks

};

