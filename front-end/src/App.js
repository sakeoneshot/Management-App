import { Fragment, useState, useRef, useEffect } from "react";
import { Link, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import "./App.css";

const today = new Date()
  .toISOString()
  .replace("-", "/")
  .split("T")[0]
  .replace("-", "/");

//Todo Component
const Todo = (props) => {
  // ref to focus inputs
  const inputEl = useRef(null);

  useEffect(() => {
    if (inputEl.current) {
      inputEl.current.focus();
    }
  });

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
    const newTodo =
      inputEl.current && inputEl.current.value !== clickedTodo.todo
        ? inputEl.current.value
        : clickedTodo.todo;

    newTodoList[todoIndex] = { todo: newTodo, isEdit: !clickedTodo.isEdit };
    setTodoList(newTodoList);
  };

  //if there is no todo list added, let the user know, otherwise display todo list
  let todoListDisplay = "No todo to display";

  const onEditCancel = (onEditTodo) => {
    const newTodo = [...todoList];
    const todoIndex = newTodo.findIndex(
      (todo) => todo.todo === onEditTodo.todo
    );
    newTodo[todoIndex] = { ...onEditTodo, isEdit: !onEditTodo.isEdit };
    setTodoList(newTodo);
  };

  if (todoList.length > 0) {
    //check if the todo is in edit, then set appropriate display

    let todoEditForm = (todo) => {
      return (
        <Fragment>
          <span>{todo.todo}</span>
          <input ref={inputEl} type="text" />
          <button onClick={onEditCancel.bind(null, todo)}>Cancel</button>
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
              <button onClick={onEditDoneClick.bind(null, todo)}>
                {todo.isEdit ? "Done" : "Edit"}
              </button>
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
  async function fetchCompanyData() {
    const data = await axios.get("http://localhost:5000/company");
    const parsedData = data.data;
    console.log("fetchCompanyData has run");
    setCompanyData(parsedData);
  }

  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const companyState = useSelector((state) => state.companyReducer);
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

  /* const onCompanyClick = (companyName) => {
     const companyIndex = companiesData.findIndex(
      (company) => company.name === companyName
    );

    const updateCompany = {
      ...companiesData[companyIndex],
      isReceived: !companiesData[companyIndex].isReceived,
    };

    const updateCompanyArr = [...companiesData];

    updateCompanyArr[companyIndex] = updateCompany;

    setCompnaiesData(updateCompanyArr); 
    dispatch({ type: "Invoice-Received", payload: companyName });
  }; */

  //send post request to server of a company to update timesheet received status and today's date
  const onInvoiceReceived = async (company) => {
    const response = await axios.post(
      "http://localhost:5000/company/updateInvoice",
      { _id: company._id, timesheetReceivedDate: today }
    );
    const companyIndex = companyData.findIndex(
      (comp) => comp._id === company._id
    );
    const newCompanyData = [...companyData];
    const newCompany = {
      ...company,
      timesheetReceived: !company.timesheetReceived,
    };

    newCompanyData[companyIndex] = newCompany;

    setCompanyData(newCompanyData);

    console.log(response);
  };

  // sort companies by timesheet received status
  const timesheetRcvdComp = [];
  const timesheetNotRcvdComp = [];

  companyData.forEach((data) => {
    if (data.timesheetReceived) {
      timesheetRcvdComp.push(data);
    } else {
      timesheetNotRcvdComp.push(data);
    }
  });

  // refresh all companies timesheet status to not received
  const onRefreshClicked = async () => {
    const response = await axios.post(
      "http://localhost:5000/company/updateInvoice"
    );
    const newCompanyData = companyData.map((company) => {
      const newCompany = { ...company, timesheetReceived: false };
      return newCompany;
    });
    setCompanyData(newCompanyData);
    console.log(response);
  };

  // display companies by timesheet received status
  const timesheetReceivedData = (
    <div>
      <div>Timesheet received company</div>
      <ul>
        {timesheetRcvdComp.map((company) => {
          return (
            <li
              key={company._id}
              onClick={onInvoiceReceived.bind(null, company)}
            >
              {company.name}
            </li>
          );
        })}
      </ul>
      <div>invoice NOT received company</div>
      <ul>
        {timesheetNotRcvdComp.map((company) => {
          return (
            <li
              key={company._id}
              onClick={onInvoiceReceived.bind(null, company)}
            >
              {company.name}
            </li>
          );
        })}
      </ul>
      <button onClick={onRefreshClicked}>Refresh</button>
    </div>
  );

  const invoiceData =
    companyData.length === 0
      ? "No Company Data available"
      : timesheetReceivedData;

  return invoiceData;
};

//employees page
const Employees = (props) => {
  const sampleEmployee = {
    name: "",

    street: "",
    city: "",
    postalCode: "",

    dob: "",
    phone: "",
    ownCar: "",
    status: "",
    note: "",
    payTax: "",
    sin: "",
  };
  const [employeeData, setEmployeeData] = useState(sampleEmployee);

  const onInputChange = (e) => {
    const newEmployee = { ...employeeData };
    newEmployee[e.target.name] = e.target.value;
    setEmployeeData(newEmployee);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/employee", employeeData)
      .then((res) => {
        console.log(res);
        setEmployeeData(sampleEmployee);
      })
      .catch((err) => console.log(err));
  };

  const employeeSubmitForm = (
    <form onSubmit={onFormSubmit}>
      <label htmlFor="name">Name: </label>
      <input
        type="text"
        id="name"
        name="name"
        value={employeeData.name}
        onChange={onInputChange}
        required={true}
      />
      <label htmlFor="street">Street: </label>
      <input
        type="text"
        id="street"
        name="street"
        value={employeeData.street}
        onChange={onInputChange}
      />
      <label htmlFor="city">City: </label>
      <input
        type="text"
        id="city"
        name="city"
        value={employeeData.city}
        onChange={onInputChange}
      />

      <label htmlFor="postalCode">Postal Code: </label>
      <input
        type="text"
        id="postalCode"
        name="postalCode"
        value={employeeData.postalCode}
        onChange={onInputChange}
      />
      <label htmlFor="dob">Date Of Birth: </label>
      <input
        type="text"
        id="dob"
        name="dob"
        value={employeeData.dob}
        onChange={onInputChange}
      />
      <label htmlFor="phone">Phone: </label>
      <input
        type="text"
        id="phone"
        name="phone"
        value={employeeData.phone}
        onChange={onInputChange}
      />
      <div>
        <p>Do you own your own car?</p>
        <label htmlFor="hasCar">
          <input
            type="radio"
            id="hasCar"
            name="ownCar"
            value="yes"
            onChange={onInputChange}
          />
          Yes
        </label>
        <label htmlFor="noCar">
          <input
            type="radio"
            id="noCar"
            name="ownCar"
            value="no"
            onChange={onInputChange}
          />
          No
        </label>
      </div>
      <div>
        <p>Eligible to work in Canada?</p>
        <label htmlFor="citizen">
          <input
            type="radio"
            id="citizen"
            name="status"
            value="citizen"
            onChange={onInputChange}
          />
          Citizen
        </label>
        <label htmlFor="PR">
          <input
            type="radio"
            id="PR"
            name="status"
            value="PR"
            onChange={onInputChange}
          />
          Permanant Resident
        </label>
        <label htmlFor="workPermit">
          <input
            type="radio"
            id="workPermit"
            name="status"
            value="workPermit"
            onChange={onInputChange}
          />
          Work Permit
        </label>
        <label htmlFor="student">
          <input
            type="radio"
            id="student"
            name="status"
            value="student"
            onChange={onInputChange}
          />
          Student
        </label>
        <label htmlFor="PGWP">
          <input
            type="radio"
            id="PGWP"
            name="status"
            value="PGWP"
            onChange={onInputChange}
          />
          PGWP
        </label>
        <label htmlFor="notEligible">
          <input
            type="radio"
            id="notEligible"
            name="status"
            value="notEligible"
            onChange={onInputChange}
          />
          Not Eligible
        </label>
      </div>
      <label htmlFor="note">Note: </label>
      <input
        type="text"
        id="note"
        name="note"
        value={employeeData.note}
        onChange={onInputChange}
      />
      <div>
        <p>Pay tax?</p>
        <label htmlFor="tax">
          <input
            type="radio"
            id="tax"
            name="payTax"
            value="yes"
            onChange={onInputChange}
          />
          Yes
        </label>
        <label htmlFor="noTax">
          <input
            type="radio"
            id="noTax"
            name="payTax"
            value="no"
            onChange={onInputChange}
          />
          No
        </label>
      </div>
      <label htmlFor="SIN">SIN: </label>
      <input
        type="text"
        id="SIN"
        name="sin"
        value={employeeData.sin}
        onChange={onInputChange}
      />

      <button>Submit</button>
    </form>
  );

  return <div>{employeeSubmitForm}</div>;
};

//it consists of two section -> one for requested works, and the other a request form
const RequestWork = (props) => {
  const [requestList, setRequestList] = useState([
    {
      _id: "testcompany",
      company: "testComp",
      workType: "gl",
      numberOfWorkers: "4",
      workers: ["a", "b", "c"],
    },
  ]);


  const onRequestDelete = (req) => {
    const newArr = requestList.filter(request => request._id !== req._id)
    setRequestList(newArr)
  }

  const reqList = (
    <ul>
      {requestList.map((request) => (
        <li key={request._id}>
          <div>
            <span>
              {request.company} - {request.workType} - {request.numberOfWorkers}{" "}
              people - going: {request.workers.join()}  
            </span>
            
            <button onClick={onRequestDelete.bind(null,request)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
  
  const onRequestSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.name)

  }

  const requestForm = (
    <form onSubmit={onRequestSubmit}>
      <label htmlFor="company">Company: </label>
      <input type="text" id="company" name="company" />
      <label htmlFor="workType">Work Type: </label>
      <input type="text" id="workType" name="workType"/>
      <label htmlFor="numberOfWorkers">Number of Workers requested: </label>
      <input type="text" id="numberOfWorkers" name="numberOfWorkers"/>
      <button>Submit</button>
    </form>
  );

  return (
    <div>
      {reqList} <hr /> {requestForm}
    </div>
  );
};

//navigation
const Nav = (props) => {
  return (
    <nav>
      <Link to="/home">To Home</Link>
      <Link to="/invoice">To Invoice</Link>
      <Link to="/todo">To Todo</Link>
      <Link to="/employees">To Employees</Link>
      <Link to="/requestWork">To request work</Link>
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
        <Route path="/employees">
          <Employees />
        </Route>
        <Route path="/requestWork">
          <RequestWork />
        </Route>

        <Route>
          <Home />
        </Route>
      </Switch>
    </Fragment>
  );
}

export default App;
