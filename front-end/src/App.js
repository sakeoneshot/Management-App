import { Fragment, useState, useRef, useEffect } from "react";
import { Link, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import "./App.css";

const SERVERURL = "http://localhost:5000";

const today = new Date()
  .toISOString()
  .replace("-", "/")
  .split("T")[0]
  .replace("-", "/");

//Todo Component
const Todo = (props) => {
  // ref to focus inputs
  const inputEl = useRef(null);

  

  // todo list array to display
  const [todoList, setTodoList] = useState([]);
  //user input for new todo
  const [curTodoInput, setCurTodoInput] = useState({ todo: "", isEdit: false });



  async function fetchTodo() {
    const fetchedTodo = await axios.get(SERVERURL + '/todo')
    setTodoList(fetchedTodo.data)
  }

  useEffect(() => {
    
    fetchTodo();
  },[]);


  //state for edit todo

  //update curTodoInput state with user input
  const onTodoInputChange = (e) => {
    setCurTodoInput((prevState) => {
      return { ...prevState, todo: e.target.value };
    });
  };
  //on form submt, add current todo input to todolist arr
  const ontodoFormSubmit = async (e) => {
    e.preventDefault();
    //create new todo list array with the new user submitted todo

    if (curTodoInput.todo.length > 0) {
      
      const postData = await axios.post(SERVERURL + '/todo',{ todo: curTodoInput.todo, createdAt: today})
      console.log(postData)

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
    const data = await axios.get(SERVERURL + "/company");
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
    const response = await axios.post(SERVERURL + "/company/updateInvoice", {
      _id: company._id,
      timesheetReceivedDate: today,
    });
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
    const response = await axios.post(SERVERURL + "/company/refreshInvoice");
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
      .post(SERVERURL + "/employee", employeeData)
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
  const sampleRequest = {
    company: "",
    type: "",
    numberOfPeople: "",
    recruitedPeople: "",
    date: today,
  };

  const [workRequest, setWorkRequest] = useState(sampleRequest);
  const [workRequests, setWorkRequests] = useState([]);

  // fetch work request from server database
  async function fetchWorkRequest() {
    const fetchResult = await axios.get(SERVERURL + "/workRequests");
    const workRequestData = fetchResult.data;
    const workRequestsEditMode = workRequestData.map((req) => {
      return { ...req, isEdit: false };
    });
    setWorkRequests(workRequestsEditMode);
  }

  //get work requests from server on component mounting
  useEffect(() => {
    fetchWorkRequest();
  }, []);

  //control forms
  const onInputChange = (e) => {
    const newRequest = { ...workRequest };

    newRequest[e.target.name] = e.target.value;
    setWorkRequest(newRequest);
  };

  //delete request
  const onRequestDelete = async (req) => {
    const result = await axios.delete(SERVERURL + "/workRequest/" + req._id);
    console.log(result);
    fetchWorkRequest();
  };

  //completes request
  const onRequestComplete = async (req) => {};

  //update worker list
  const onWorkerUpdate = async (req) => {
    const result = await axios.put(SERVERURL + "/workRequest", {
      _id: req._id,
      recruitedPeople: workRequest.recruitedPeople,
    });
    setWorkRequest((state) => {
      return { ...state, recruitedPeople: "" };
    });
    fetchWorkRequest();
    console.log(result);
  };

  //trigger workerupdate
  const triggerWorkerUpdate = (req) => {
    const index = workRequests.findIndex(
      (workRequest) => workRequest._id === req._id
    );
    if (index >= 0) {
      const newWorkRequestArr = [...workRequests];
      const workReqObj = {
        ...workRequests[index],
        isEdit: !workRequests[index].isEdit,
      };
      newWorkRequestArr[index] = workReqObj;
      setWorkRequests(newWorkRequestArr);
    }
  };

  //worker update form

  //on adding workers
  const onAddWorkers = (req, e) => {
    const index = workRequests.findIndex(
      (workRequest) => workRequest._id === req._id
    );
    const newWorkRequestArr = [...workRequests];
    const workReqObj = {
      ...workRequests[index],
      recruitedPeople: e.target.value,
    };
    newWorkRequestArr[index] = workReqObj;
    setWorkRequests(newWorkRequestArr);
  };
  //let workerUpdateForm = null;
  const workerUpdateForm = (req) => {
    return req.isEdit ? (
      <div>
        <label htmlFor="recruitedPeople">Workers: </label>
        <input
          type="text"
          id="recruitedPeople"
          name="recruitedPeople"
          value={req.recruitedPeople}
          onChange={onAddWorkers.bind(null, req)}
        />
        <button onClick={onWorkerUpdate}>Confirm</button>
        <button onClick={triggerWorkerUpdate.bind(null, req)}>Cancel</button>
      </div>
    ) : (
      "no worker present"
    );
  };

  // work requests display
  let reqList =
    workRequests.length === 0 ? (
      "request not present"
    ) : (
      <ul>
        {workRequests.map((request) => (
          <li key={request._id}>
            <div>
              <span>
                {request.company} - {request.type} - {request.numberOfPeople}{" "}
                people - going: {request.recruitedPeople}
              </span>
              {workerUpdateForm(request)}
              {!request.isEdit && (
                <button onClick={triggerWorkerUpdate.bind(null, request)}>
                  Edit
                </button>
              )}
              <button
                disabled={request.isEdit}
                onClick={onRequestComplete.bind(null, request)}
              >
                Complete
              </button>

              <button
                disabled={request.isEdit}
                onClick={onRequestDelete.bind(null, request)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  //send post request of submitted work request
  const onRequestSubmit = async (e) => {
    e.preventDefault();
    const result = await axios.post(SERVERURL + "/workRequest", workRequest);
    setWorkRequest(sampleRequest);
    fetchWorkRequest();
    console.log(result);
  };

  const requestForm = (
    <form onSubmit={onRequestSubmit}>
      <label htmlFor="company">Company: </label>
      <input
        type="text"
        id="company"
        name="company"
        value={workRequest.company}
        onChange={onInputChange}
      />
      <label htmlFor="type">Work Type: </label>
      <input
        type="text"
        id="type"
        name="type"
        value={workRequest.type}
        onChange={onInputChange}
      />
      <label htmlFor="numberOfPeople">Number of Workers requested: </label>
      <input
        type="text"
        id="numberOfPeople"
        name="numberOfPeople"
        value={workRequest.numberOfPeople}
        onChange={onInputChange}
      />
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
      <Link to="/company">To Company</Link>
    </nav>
  );
};

// company

const Company = (props) => {
  //initial company
  const companyStructure = {
    name: "",
  };

  //company data
  const [fetchedCompanies, setfetchedCompanies] = useState([]);
  //company form control state
  const [companyFormData, setCompanyFormData] = useState(companyStructure);

  //get company data
  const fetchCompanyData = async () => {
    const result = await axios.get(SERVERURL + "/company");
    const fetchedData = result.data;
    if (fetchedData && fetchedData.length > 0) {
      setfetchedCompanies(fetchedData);
      console.log(fetchedData);
    }
  };

  // fetch companies from database on component mount
  useEffect(() => {
    fetchCompanyData();
  }, []);

  //fetch companies

  //company list
  let companyList = "No company available, try adding one";
  companyList = fetchedCompanies.length > 0 && (
    <ul>
      {fetchedCompanies.map((company) => (
        <li key={company._id}>{company.name}</li>
      ))}
    </ul>
  );

  //update company
  

  //delete company




  //company forms
  //handle company form data input
  const onCompnayFormDataChange = (e) => {
    const newForm = { ...companyFormData };

    newForm[e.target.name] = e.target.value;

    setCompanyFormData(newForm);
  };

  //handles form submit
  const onCompanyDataSubmit = async (e) => {
    e.preventDefault();

    if (companyFormData.name) {
      const result = await axios.post(SERVERURL + "/company", companyFormData);
      console.log(result);
      setCompanyFormData(companyStructure);
      fetchCompanyData();
    }
  };

  // company form
  const companyForm = (
    <form onSubmit={onCompanyDataSubmit}>
      <label htmlFor="name">Company name: </label>
      <input
        type="text"
        name="name"
        id="name"
        value={companyFormData.name}
        onChange={onCompnayFormDataChange}
      />
      <button>Submit</button>
    </form>
  );

  return (
    <div>
      <div>{companyList}</div>
      <div>{companyForm}</div>
    </div>
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
          <Company />
        </Route>

        <Route>
          <Home />
        </Route>
      </Switch>
    </Fragment>
  );
}

export default App;
