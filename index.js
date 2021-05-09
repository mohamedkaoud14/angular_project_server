const e = require('express');
const express = require('express');

const fs = require('fs')
const app = express();
const port = process.env.PORT || 3007; 

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(); 
});
app.use(express.json());
const students = JSON.parse(

    fs.readFileSync('./data/students.json')
)
app.get('/', (req, res) => {

    res.status(200).json(students)

})

app.get('/api/v1/students', (req, res) => {

    res.status(200).json(students)

})

app.get('/api/v1/students/:id', (req, res) => {
    console.log(req.params.id)
    const newid = req.params.id * 1
    const selected = students.find((el) => {

        return el.id === newid
    })

    if (!selected) {

        res.status(404).json(
            {
                status: "fails ",

                message: "not found"

            })


    } else {
        res.status(200).json(selected)




    }



})
app.patch('/api/v1/students/:id', (req, res) => {

    console.log(req.params.id)
    const newid = req.params.id * 1
    const selectedIndex = students.findIndex((el) => {
        return el.id === newid
    })
    if (selectedIndex === -1) {

        res.status(404).json(
            {
                status: "fails to update ",
                message: "not found"
            })


    } else {
        students[selectedIndex] = {...req.body}
        fs.writeFile('./data/students.json', JSON.stringify(students), (error) => {

            console.log(error);
        })

        console.log("update", req.body)
        res.status(200).json(
            {
                status: "success ",
                message: "we pretend like we update it"

            })

    }
})

app.delete('/api/v1/students/:id', (req, res) => {
    console.log(req.params.id)
    const newid = req.params.id * 1
    const selectedIndex = students.findIndex((el) => {

        return el.id === newid
    })
    console.log("selectedIndex", selectedIndex)


    if (selectedIndex == -1) {


        res.status(404).json(
            {
                status: "fails to delete ",
                message: "not found"
            })


    } else {
        students.splice(selectedIndex, 1);
        fs.writeFile('./data/students.json', JSON.stringify(students), (error) => {

            console.log(error);
        })
        res.status(204).json(
            {
                status: "success ",
                data: null

            })

    }
})
app.post('/api/v1/students', (req, res) => {
    const newID = students[students.length - 1].id + 1
    console.log("newID ", newID)

    const newStudent = Object.assign({ id: newID }, req.body)
    console.log("newstudendbe", newStudent)

    students.push(newStudent)
    console.log("after", students)
    fs.writeFile('./data/students.json', JSON.stringify(students), (error) => {
        console.log(error);
    })
    res.status(201).json(
        {
            status: "success ",
            data: {
                students: newStudent
            }
        })

})

app.listen(port, () => {
    console.log(` server is working on ${port} `)
})