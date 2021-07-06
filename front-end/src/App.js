import { Fragment, useState, useRef, useEffect } from "react";
import { Link, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";

//Todo Component
const Todo = (props) => {
  
  const today = new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/');
  // ref to focus inputs
  const inputEl = useRef(null);

  useEffect(() => {
    if (inputEl.current) {
      inputEl.current.focus();
    }
  })

  // todo list array to display
  const [todoList, setTodoList] = useState([]);
  //user input for new todo
  const [curTodoInput, setCurTodoInput] = useState({ todo: "", isEdit: false });
  //state for edit todo
  


  //update curTodoInput state with user input
  const onTodoInputChange = (e) => {
    setCurTodoInput((prevState) => {
      return { ...prevState, todo: e.target.value };
    });
  };
  //on form submt, add current todo input to todolist arr
  const ontodoFormSubmit = (e) => {
    e.preventDefault();
    //create new todo list array with the new user submitted todo

    if (curTodoInput.todo.length > 0) {
      const newTodo = [...todoList];

      newTodo.push({ ...curTodoInput });
  
      setTodoList(newTodo);
  
      //reset userinput to empty string
      setCurTodoInput({ todo: "", isEdit: false });
    }
    
  };
  //todo form with an input field for user to type todo and button for submission
  const todoForm = (
    <form onSubmit={ontodoFormSubmit}>
      <input
        type="text"
        value={curTodoInput.todo}
        onChange={onTodoInputChange}
      />
      <button>Submit</button>
    </form>
  );

  //when triggered, allow user to update selected todo
  const onEditDoneClick = (clickedTodo) => {
    //get selected todo
    //set isedit property to !isedit
    const newTodoList = [...todoList];
    const todoIndex = newTodoList.findIndex(
      (todo) => todo.todo === clickedTodo.todo
    );
    const newTodo = inputEl.current && inputEl.current.value !== clickedTodo.todo? inputEl.current.value : clickedTodo.todo

    newTodoList[todoIndex] = { todo: newTodo, isEdit: !clickedTodo.isEdit };
    setTodoList(newTodoList);


  };

  //if there is no todo list added, let the user know, otherwise display todo list
  let todoListDisplay = "No todo to display";

  
  const onEditCancel = (onEditTodo) => {
    const newTodo = [...todoList];
    const todoIndex = newTodo.findIndex(todo => todo.todo === onEditTodo.todo)
    newTodo[todoIndex] = {...onEditTodo, isEdit: !onEditTodo.isEdit}
    setTodoList(newTodo);

  }



  if (todoList.length > 0) {
    //check if the todo is in edit, then set appropriate display

    

    let todoEditForm = (todo) => {
      return (
        <Fragment>
          <span>{todo.todo}</span>
          <input ref={inputEl} type="text"  />
          <button onClick={onEditCancel.bind(null,todo)}>Cancel</button>
        </Fragment>
      );
    };

    let todoDisplay = (todo) => {
      return todo.isEdit ? todoEditForm(todo) : todo.todo;
    };

    todoListDisplay = (
      <ul>
        {todoList.map((todo) => {
          return (
            <li key={Math.random()}>
              {todoDisplay(todo)}
              <button onClick={onEditDoneClick.bind(null, todo)}>{todo.isEdit? 'Done' : 'Edit'}</button>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div>
      {today}
      {todoListDisplay}
      {todoForm}
    </div>
  );
};

//formtest
const FormTest = (props) => {
  const sendFormData = (e) => {
    e.preventDefault();
    //send data to server
    console.log(e.target.name.value, e.target.phone.value);
    //display data
  };
  return (
    <form onSubmit={sendFormData}>
      <label htmlFor="name">Name: </label>
      <input type="text" name="name" />
      <label htmlFor="phone">Phone: </label>
      <input type="text" name="phone" />

      <button>Submit</button>
    </form>
  );
};

//display invoice received state for each company
const Invoice = (props) => {

  const companyState = useSelector(state => state.companyReducer);
  const dispatch = useDispatch();


  /* const dummyCompanyList = [
    {
      name: "CompanyA",
      isReceived: false,
    },
    {
      name: "CompanyB",
      isReceived: false,
    },
    {
      name: "CompanyC",
      isReceived: false,
    },
  ]; */

  //const [companiesData, setCompnaiesData] = useState(dummyCompanyList);

  const onCompanyClick = (companyName) => {
    /* const companyIndex = companiesData.findIndex(
      (company) => company.name === companyName
    );

    const updateCompany = {
      ...companiesData[companyIndex],
      isReceived: !companiesData[companyIndex].isReceived,
    };

    const updateCompanyArr = [...companiesData];

    updateCompanyArr[companyIndex] = updateCompany;

    setCompnaiesData(updateCompanyArr); */
    dispatch({type: "Invoice-Received", payload: companyName})
    
  };

  const invoiceText = (company) => {
    if (company.invoice) {
      return `${company.name} : invoice received`;
    } else {
      return `${company.name} : invoice NOT received yet`;
    }
  };

  return (
    <ul>
      {companyState.map((company) => {
        return (
          <li
            key={company.name}
            onClick={onCompanyClick.bind(null,company.name)}
          >
            {invoiceText(company)}
          </li>
        );
      })}
    </ul>
  );
};

//list of workers request 

//navigation
const Nav = (props) => {
  return (
    <nav>
      <Link to="/home">To Home</Link>
      <Link to="/invoice">To Invoice</Link>
      <Link to="/todo">To Todo</Link>
    </nav>
  );
};

//home

const Home = (props) => {
  return <div>Home works!</div>;
};

//main app component
function App() {
  //const [dummy, setDummy] = useState([...dummyData]);

  // send data to server once successful, display data through todo component

  return (
    <Fragment>
      <Nav />

      <Switch>
        <Route path="/invoice">
          <Invoice />
        </Route>
        <Route path="/form-test">
          <FormTest />
        </Route>
        <Route path="/todo">
          <Todo />
        </Route>
        <Route path="/work-send">

        </Route>

        <Route>
          <Home />
        </Route>
      </Switch>
    </Fragment>
  );
}

export default App;
