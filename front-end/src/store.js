import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { v4 as uuidv4 } from "uuid";

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//section for company state, reducer
const companies = [
  {
    name: "CompanyA",
    invoice: false,
  },
  {
    name: "CompanyB",
    invoice: false,
  },
  {
    name: "CompanyC",
    invoice: false,
  },
];

const companyReducer = (state = companies, action) => {
  if (action.type === "Invoice-Received") {
    const newState = [...state];
    const receivedCompany = newState.findIndex(
      (company) => company.name === action.payload
    );
    newState[receivedCompany] = {
      ...newState[receivedCompany],
      invoice: !newState[receivedCompany].invoice,
    };

    return newState;
  }
  return state;
};

//section for todo state

/* const initialTodo = {
  dayTodo: [
    {
      date: '2021/7/8',
      todo: [
        {
          type: 'day',
          todo: 'todo',
          id: uuidv4(),
          isEdit: false,
          isDone: false,
          createdAt: new Date()
        }
      ]
    }
  ],
  longTermTodo: [
    {
      date: '2021/7/8',
      type: 'long-term',
      todo: 'long term todo',
      id: uuidv4(),
      isEdit: false,
      isDone: false
    }
  ],
  doneTodo: [
    {
      todo: [
        {
          todo: todo
        }
      ]
    }
  ]
}; */

const initialTodo = {
  dailyTodo: [
    {
      date: null,
      todo: [
        {
          id: null,
          //longterm or daily
          type: null,
          todo: null,
          isDone: false,
        },
      ],
    },
  ],

  longTermTodo: [
    {
      date: null,
      id: null,
      //longterm or daily
      type: null,
      todo: null,
      isDone: false,
    },
  ],

  doneTodo: [
    {
      date: null,
      id: null,
      //longterm or daily
      type: null,
      todo: null,
      isDone: false,
    },
  ],
};
const todoReducer = (state = initialTodo, action) => {
  switch (action.type) {
    case "ADD_DAILY_TODO":
      const dailyIndex = state.dailyTodo.findIndex(todo => todo.date === action.payload.date)
      
      if (dailyIndex < 0) {
        const newTodo = {
          id: uuidv4(),
          type: action.payload.type,
          todo: action.payload.todo,
          isDone: false,
        };
      }

      


      //const dateIndex = state.findIndex(todo => todo.date === action.payload.date);
      /* if (dateIndex < 0) {
        const newTodoObj = { id: uuidv4(), date: action.payload.date, todo: [newTodo] }
        const newTodoArr = [...state];
        newTodoArr.push(newTodoObj);

        return newTodoArr;
      } */

      return state;
    default:
      return state;
  }
};


//employee state and reducer


//default practice state
const initialState = { state: "default" };
const reducer = (state = initialState, action) => {
  return state;
};

const rootReducer = combineReducers({ companyReducer, reducer });

//onst middleware = () => {}

const store = createStore(rootReducer);

//const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
//    applyMiddleware(...middleware)
//));

export default store;
