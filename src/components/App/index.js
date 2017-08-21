import React, { Component } from 'react';
import Header from '../Header/Header';
import './style.css';


function ToDoList(props) {
  const items  = props.items;
  if(items.length > 0) {
    const listItems = items.map( (item, index) => <li key={index} onClick={() => props.onClick(index)} title="Mark as done">&nbsp;{item.name} {item.createDate}, {item.status}</li>);
    return (<ul className="todo-list"><li><h3>Tasks</h3></li>{listItems}</ul>);
  } else {
    return (<ul className="todo-list"><li><h3>Tasks</h3></li><li>No new tasks.</li></ul>);
  }
}

function ToDoDone(props) {
  const items = props.itemDone;
  if(items.length > 0) {
    const listItems = items.map( (item, index) => <li key={index} onClick={() => props.onClick(index)}>&nbsp;<del>{item}</del></li>);
    return (<ul className="done-list"><h3>Task Completed</h3>{listItems}</ul>);
  }else {
    return (<ul className="done-list"><h3>Task Completed</h3><li>No Task Completed</li></ul>);
  }
}


class TaskAction extends React.Component {
  render() {
    return(
      <ul className="task-actions">
      <li href="#" className="badge badge-pill badge-primary">Ongoing</li>
      <li href="#" className="badge badge-pill badge-secondary">Pending</li>
      <li href="#" className="badge badge-pill badge-success ">Done</li>
      </ul>
      )
  }
}
class Task extends Component {
  constructor(props) {
    super(props);

    this.state = {
      taskStatus: {
        pending : 'secondary',
        ongoing : 'primary',
        done : 'success'
      }
    }
  }
  render() {
    const status = this.props.task.status;
    return(
      <li className="list-group-item" data-id={this.props.task._id}>
      {this.props.task.name} <span className="badge badge-+{this.state.taskStatus[status]}">{status}</span><hr/>
      <TaskAction />
      </li>
      );
  }
}

class ToDoTasks extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const tasks = this.props.items.map((task, index) => <Task task={task} key={task._id}/>);
    return(
      <div>
      <h3>Tasks</h3>
      <ul className="list-group" id="task-list">{tasks}</ul>
      </div>
      );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {     
      items:[], 
      itemPending: [],
      itemDone : [],
      value: null
    }

    this.handleNewTaskSubmit = this.handleNewTaskSubmit.bind(this);

  }
  componentDidMount() {
    fetch('http://localhost:3000/tasks') 
    .then( result => result.json())
    .then(items => this.setState({items}));

  }
  reloadTasks() {
    fetch('http://localhost:3000/tasks') 
    .then( result => result.json())
    .then(items => this.setState({items}));

  }
  handleItemDone(index) {
    const prevItems = this.state.itemPending.slice();
    const itemDropped = prevItems.splice(index,1);
    // console.log(itemDropped[0]);
    const itemsDone = this.state.itemDone.slice();
    const newItemsDone = itemsDone.concat(itemDropped[0]);
    this.setState((prevState) => ({
      itemPending: prevItems,
      itemDone: newItemsDone,
      items: {}
    }));
  }
  handleAddItem(index) {
    const prevItems = this.state.itemDone.slice();
    const itemDropped = prevItems.splice(index,1);
    const itemsPending = this.state.itemPending.slice();
    const newItemsPending = itemsPending.concat(itemDropped[0]);    
    this.setState((prevState) => ({
      itemPending: newItemsPending,
      itemDone: prevItems
    }));
  }
  handleNewTaskSubmit(e) {
    e.preventDefault();
    const task_name = e.target.task_name.value;
    // console.log(task_name);

    fetch('http://localhost:3000/tasks/createTask', {
      method: 'POST',
      //mode: 'CORS',
      body: JSON.stringify({
        "name": e.target.task_name.value,
      }),
      headers : {
        'Content-type': 'application/json'
      },
    }).then((response) => response.json())
      .then(() => this.reloadTasks())
      .catch((error) => console.error(error));

    

    e.target.task_name.value = "";
  }
  render() {
    return (
      <div>
      <Header />
      <div className="col-md-4 col-sm-10">
      <form onSubmit={this.handleNewTaskSubmit} className="form-inline " method="POST">
      <div className="form-group">
      <label>Task Name:<input type="text" name="task_name" onChange={this.handleChange} className="form-control" /></label>
      </div>
      <input type="submit" value="Submit" className="btn btn-primary"/>
      </form>
      <ToDoTasks items={this.state.items} onClick={(i) =>this.handleItemDone(i)} onChange={(i)=>this.handleItemDone(i)}/>
      <ToDoDone itemDone={this.state.itemDone} onClick={(i)=>this.handleAddItem(i)} onChange={(i)=>this.handleAddItem(i)} />
      </div>
      </div>
      );
  }
}

export default App;
