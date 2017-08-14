import React, { Component } from 'react';
import './style.css';


function ToDoList(props) {
  const items  = props.itemPending;
  if(items.length > 0) {
    const listItems = items.map( (item, index) => <li key={index} onClick={() => props.onClick(index)}>&nbsp;{item}</li>);
    return (<ul className="todo-list"><h3>To Do Tasks</h3>{listItems}</ul>);
  } else {
    return (<ul className="todo-list"><h3>To Do Tasks</h3><li>No new tasks.</li></ul>);
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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {      
      itemPending: [],
      itemDone : [],
      value: null
    }

    this.handleNewTaskSubmit = this.handleNewTaskSubmit.bind(this);

  }
  componentDidMount() {
    fetch('http://localhost:8000/api/getImage/1') 
      .then(result=>result.json())
      .then(items=> {this.setState({items}); console.log({items})});


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
    this.setState((prevState) => ({
      itemPending: prevState.itemPending.concat(task_name)
    }));
    e.target.task_name.value = "";
  }
  render() {
    return (
      <div>
      <form onSubmit={this.handleNewTaskSubmit} className="form-inline ">
      <h3>ToDo App</h3>
      <div className="form-group">
      <label>
      Task Name:
      <input type="text" name="task_name" onChange={this.handleChange} className="form-control" />
      </label>
      </div>
      <input type="submit" value="Submit" className="btn btn-primary"/>
      </form>
      <ToDoList itemPending={this.state.itemPending} onClick={(i) =>this.handleItemDone(i)} onChange={(i)=>this.handleItemDone(i)}/>
      <ToDoDone itemDone={this.state.itemDone} onClick={(i)=>this.handleAddItem(i)} onChange={(i)=>this.handleAddItem(i)} />
      </div>
      );
  }
}

export default App;
