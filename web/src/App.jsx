import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios'
import './App.css'
const url = 'http://localhost:5001'
function App() {

  const [input, setInput] = useState()
  const [todos, setTodos] = useState()
  const [loadProduct, setLoadProduct] = useState(true)



  const getAllProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/getData`)
      console.log(response)
      setTodos(response.data.data.reverse())
    } catch (error) {
      console.log("error in getting all Todos", error);
    }
  }

  useEffect(() => {
    getAllProducts()
  }, [loadProduct])


  const sendData = async () => {
    try {
      console.log(loadProduct)
      setLoadProduct(!loadProduct)
      console.log(loadProduct)
      await axios.post(`${url}/addData`, { input });
    } catch (error) {
      console.log(error)
    }

  }


  const submitData = (e) => {
    const updatedValue = document.getElementById(`${e}i`).value;
    const x = document.getElementById(`${e}r`);
    x.style.display = "none";
    const idOfDiv = document.getElementById(`${e}k`).innerText;
    console.log(idOfDiv)



    try {
      setLoadProduct(!loadProduct)
      axios.put(`http://localhost:5001/edit/${idOfDiv}`, {
        name: updatedValue,

      })

    } catch (error) {

      console.log(error)

    }





  }

  const deleteTodo = async (e) => {
    const deleteData = e
    setLoadProduct(!loadProduct)
    try {
      const response = await axios.delete(`http://localhost:5001/delete/${deleteData}`)
      console.log(response)
    } catch (error) {
      console.log(error)
    }

  }



  const edit = (e, inputValue) => {
    const y = document.getElementById(`${e}i`).value = inputValue;
    const x = document.getElementById(`${e}r`);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }

  }


  return (
    <div className="App">
      <input type="text" onChange={(e) => {
        setInput(e.target.value)
      }} />
      <button style={{ "border": '1px solid black' }} onClick={sendData} >Send Data !!!!</button>
      <h1>Data Here!!!</h1>
      {todos ? todos.map((eachvalue, i) => (
        <div className='fff' id={i} key={i}>
          <h1>{eachvalue.name}</h1>
          <h1>{eachvalue.createdOn}</h1>
          <h1 id={`${i}k`} >{eachvalue._id}</h1>
          <button onClick={() => {
            deleteTodo(eachvalue._id)
          }} style={{ "border": "1px solid black" }} >Delete</button> <br />
          <button onClick={() => {
            edit(i, eachvalue.name)
          }} >Edit </button>
          {/* {promt ?       <div> <input type="text" /> <button>Update</button> </div>   : null } */}

          <div id={`${i}r`} style={{ "display": "none" }} >
            <input id={`${i}i`} type="text" />
            <button onClick={() => {
              submitData(i)
            }} >Submit </button>
          </div>

        </div>
      )) : `Loading...`}





    </div>
  )
}
export default App
