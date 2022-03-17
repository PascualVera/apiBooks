let express = require("express")
let mysql = require("mysql2")
let app = express()
let cors = require("cors")
const { param } = require("express/lib/request")
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

let connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "sql994",
	database: "library",
})
connection.connect(function (error) {
	if (error) {
		console.log(error)
	} else {
		console.log("Connected")
	}
})
app.post("/registro", function (request, response) {
	console.log("funciona")
	let { nombre, apellidos, correo, foto, password } = request.body
	let params = [nombre, apellidos, correo, foto, password]
	let sql = "INSERT INTO usuario (nombre, apellidos, correo, foto, password) VALUE (?);"
	console.log(params)
	connection.query(sql, [params], (err, result) => {
		if (err) console.log(err)
		else {
			if (err) console.log(err)
			else {
				console.log(result)
				if (result.insertId) response.send(String(result.insertId))
				else response.send("-1")
			}
		}
	})
})
app.post("/login", function (request, response) {
	let correo = request.body.correo
	let password = request.body.password
	let params = [correo, password]

	let sql = "SELECT id_usuario, nombre, apellidos, correo, foto FROM usuario WHERE correo = ? AND password = ?;"
	connection.query(sql, params, (err, result) => {
		if (err) {
			console.log(err)
		} else {
			if (result.length != 0) {
				response.send(result)
			} else {
				response.status(404).send("Correo o contraseña incorrecta")
			}
		}
	})
})
app.get("/libros", (req, res, next) => {
	let id = req.query.name
	if (id == undefined) {
		next()
	}
	let sql = "SELECT * FROM libro WHERE id_usuario = " + id
	connection.query(sql, (err, result) => {
		if (err) {
			console.log(err)
			res.send(err)
		} else {
			res.send(result)
		}
	})
})
app.get("/libros", (req, res) => {
	let { id_libro, id_usuario } = req.query
	let sql = "SELECT * FROM libro WHERE id_libro = " + id_libro + "AND id_usuario =" + id_usuario
	connection.query(sql, (err, result) => {
		if (err) {
			console.log(err)
			res.send(err)
		} else {
			res.send(result)
		}
	})
})

app.post("/libros", (req, res) => {
	let { id_usuario, titulo, tipoLibro, autor, precio, photo, sinopsis } = req.body
	let params = [id_usuario, titulo, tipoLibro, autor, precio, photo, sinopsis]
	console.log(params)
	let sql = "INSERT INTO libro (id_usuario,titulo,tipoLibro,autor,precio,photo,sinopsis) VALUES (?);"
	console.log(sql)
	connection.query(sql, [params], (err, result) => {
		if (err) {
			console.log(err)
		} else {
			console.log(result)
			if (result.insertId) {
				console.log(result.insertId)
				res.send(result)
			} else {
				res.send("-1")
			}
		}
	})
})
app.put("/libros", (req, res) => {
	let { id_libro, id_usuario, titulo, tipoLibro, autor, precio, photo, sinopsis } = req.body
	let params = [id_usuario, titulo, tipoLibro, autor, precio, photo, sinopsis]
	console.log(params)
	let sql = `UPDATE libro SET id_usuario = COALESCE(?,id_usuario),
  titulo = COALESCE(?,titulo),
  tipoLibro = COALESCE(?,tipoLibro),
  autor = COALESCE(?,autor),
  precio = COALESCE(?,precio),
  photo = COALESCE(?,photo),
  sinopsis = COALESCE(?,sinopsis)
  WHERE id_libro = ${id_libro}`
	connection.query(sql, params, (err, result) => {
		if (err) {
			console.log(err)
		} else {
			console.log(result)
			res.send(result)
		}
	})
})
app.delete("/libros", (req, res) => {
	let id = req.query.id
	let sql = `DELETE FROM libro WHERE id_libro = ${id}`
	connection.query(sql, (err, result) => {
		if (err) {
			console.log(err)
		} else {
			console.log(result)
			res.send(result)
		}
	})
})
app.listen(3000, () => {
	console.log("Server listening on port 3000")
})
