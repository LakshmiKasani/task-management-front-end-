import React, { Component } from 'react';
import { Table, Button, Form, Col, Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from './Sidebar';
import './Admin.css';
import { format } from 'date-fns';
import { withRouter } from 'react-router-dom';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getApiData:[],
      name: "",
      newData:[],
      email: '',
      mobileNumber: '',
      skills: '',
      selectedDate: new Date(),
      isEditing: false,
      tasks: [
        {
          id: 1,
          task: '',
          gmail: '',
          description: 'Task description',
          files: [],
          createTime: new Date('2024-09-01T12:00:00'),
          assignedTime: new Date('2024-09-02T10:00:00'),
          workCompleteTime: new Date('2024-09-05T16:00:00'),
          employeeComment: 'Employee comment',
          managerComment: 'Manager comment',
          createStatus: '',
          assignedStatus: '',
          workCompleteStatus: '',
          createStatusTime: null,
          assignedStatusTime: null,
          workCompleteStatusTime: null,
        },
      ],
    };
  }

  handleSaveChanges = () => {
    this.setState((prevState) => {
      const updatedTasks = prevState.tasks.map((task) => ({
        ...task,
        createStatusTime: task.createStatus ? new Date() : task.createStatusTime,
        assignedStatusTime: task.assignedStatus ? new Date() : task.assignedStatusTime,
        workCompleteStatusTime: task.workCompleteStatus ? new Date() : task.workCompleteStatusTime,
      }));

      return { tasks: updatedTasks, isEditing: false };
    });
    alert('Changes saved!');
  };

  handleSelectEmployee = (name2) => {
    const {name,getApiData} = this.state
    const a = getApiData.filter(c => c.employeeName === name2[0])
    this.setState({name:a[0]})
  };

  formatDate = (date) => (date ? format(new Date(date), 'yyyy-MM-dd HH:mm') : 'N/A');

  handleLogout = () => {
    this.props.history.push('/login');
  };

  handleEditClick = () => {
    this.setState({ isEditing: true });
  };

  handleInputChange = (e, index, field) => {
    const { value } = e.target;
    const updatedTasks = [...this.state.tasks];
    updatedTasks[index][field] = value;
    this.setState({ tasks: updatedTasks });
  };

  handleFileChange = (e, index) => {
    const { files } = e.target;
    const updatedTasks = [...this.state.tasks];
    const fileNames = Array.from(files).map((file) => file.name);
    updatedTasks[index].files = fileNames;
    this.setState({ tasks: updatedTasks });
  };

  handleMobileNumberChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 10) {
      this.setState({ mobileNumber: value });
    }
  };

  handleTeamsClick = () => {
    const chatUrl = `https://teams.microsoft.com/l/chat/0/0?users=${this.state.name}`;
    window.location.href = chatUrl;
  };

  handleRadioChange = (e, index, field) => {
    const { value } = e.target;
    const updatedTasks = [...this.state.tasks];
    updatedTasks[index][field] = value;
    this.setState({ tasks: updatedTasks });
  };

  handleTaskClick = (taskId) => {
    this.props.history.push(`/tasks/${taskId}`);
  };

  handleAddTask = () => {
    const newTask = {
      id: this.state.tasks.length + 1,
      task: '',
      gmail: '',
      description: '',
      files: [],
      createTime: new Date(),
      assignedTime: null,
      workCompleteTime: null,
      employeeComment: '',
      managerComment: '',
      createStatus: '',
      assignedStatus: '',
      workCompleteStatus: '',
      createStatusTime: null,
      assignedStatusTime: null,
      workCompleteStatusTime: null,
    };
    this.setState((prevState) => ({ tasks: [...prevState.tasks, newTask] }));
  };

  removeTask = (index) => {
    this.setState((prevState) => {
      const updatedTasks = prevState.tasks.filter((_, i) => i !== index);
      return { tasks: updatedTasks };
    });
  };

  componentDidMount() {
    this.getApiEmployeesData()
  }

  getApiEmployeesData = async ()=>{
    const {getApiData} = this.state
    const url = "http://localhost:4000/employeeDataAdd"
    const response = await fetch(url,{
      method:"GET"
    })
    const data = await response.json()
    this.setState({getApiData:data})
  }
  

  render() {
    const { newData,name, email, mobileNumber, skills, selectedDate, tasks, isEditing } = this.state;
    const {getApiData} = this.state
    console.log(name)

    return (
      <div className="admin-background">
        <Container fluid>
          <Row>
            <Col md={3}>
              <Sidebar prop={getApiData} onSelectEmployee={this.handleSelectEmployee} />
            </Col>

            <Col md={9}>
              <div className="header">
                <h1 className="head001">Admin Dashboard</h1>
                <Button variant="danger" onClick={this.handleLogout} className="logout-btn">
                  Logout
                </Button>
              </div>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="name">
                    <Form.Label>Name: </Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" value={name.employeeName} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="email">
                    <Form.Label>Email: </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      value={name.gmailId}
                      onChange={(e) => this.setState({ email: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="mobileNumber">
                    <Form.Label>Mobile Number: </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Mobile Number"
                      value={mobileNumber}
                      onChange={this.handleMobileNumberChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="skills">
                    <Form.Label>Skills: </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Skills"
                      value={skills}
                      onChange={(e) => this.setState({ skills: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Button variant="info" onClick={this.handleTeamsClick}>
                    Teams
                  </Button>
                </Col>
              </Row>

              {/* {getApiData.map(char=>(
          <h1>{char.employeeName}</h1>
        ))} */}

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Date:</Form.Label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => this.setState({ selectedDate: date })}
                      dateFormat="dd-MM-yyyy"
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Email</th>
                        <th>Description</th>
                        <th>Files</th>
                        <th>Create Date & Time</th>
                        <th>Create Status</th>
                        <th>Assigned Date & Time</th>
                        <th>Assigned Status</th>
                        <th>Complete Date & Time</th>
                        <th>Complete Status</th>
                        <th>Employee Comment</th>
                        <th>Manager Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task, index) => (
                        <tr key={task.id}>
                          <td>
                            <Button onClick={() => this.removeTask(index)} variant="secondary" className="ml-2">
                              Delete
                            </Button>
                            {isEditing ? (
                              <Form.Control
                                type="text"
                                value={task.task}
                                onChange={(e) => this.handleInputChange(e, index, 'task')}
                              />
                            ) : (
                              <a href="#" onClick={() => this.handleTaskClick(task.id)}>
                                {index + 1}. {"Task: " + task.task}
                              </a>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <Form.Control
                                type="text"
                                value={task.gmail}
                                onChange={(e) => this.handleInputChange(e, index, 'gmail')}
                              />
                            ) : (
                              task.gmail
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <Form.Control
                                type="text"
                                value={task.description}
                                onChange={(e) => this.handleInputChange(e, index, 'description')}
                              />
                            ) : (
                              task.description
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <Form.Control
                                type="file"
                                multiple
                                onChange={(e) => this.handleFileChange(e, index)}
                              />
                            ) : (
                              task.files.join(', ') || 'No files'
                            )}
                          </td>
                          <td>{this.formatDate(task.createTime)}</td>
                          <td>{task.createStatus}</td>
                          <td>{this.formatDate(task.assignedTime)}</td>
                          <td>{task.assignedStatus}</td>
                          <td>{this.formatDate(task.workCompleteTime)}</td>
                          <td>{task.workCompleteStatus}</td>
                          <td>{task.employeeComment}</td>
                          <td>{task.managerComment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {isEditing && (
                    <Button variant="primary" onClick={this.handleSaveChanges}>
                      Save Changes
                    </Button>
                  )}
                  <Button variant="secondary" onClick={this.handleEditClick} className="ml-2">
                    Edit
                  </Button>
                  <Button variant="success" onClick={this.handleAddTask} className="mb-3">
                    Add Task
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Admin














// import React, { useState } from 'react';
// import { Table, Button, Form, Col, Row, Container } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css'; 
// import Sidebar from './Sidebar';
// import './Admin.css';
// import { format } from 'date-fns'; 
// import { useNavigate } from 'react-router-dom'; 

// const Admin = () => {
//   const [state, setState] = useState({
//     name: '',
//     email: '',
//     mobileNumber: '',
//     skills: '',
//     selectedDate: new Date(),
//     isEditing: false,
//     tasks: [
//       {
//         id: 1,
//         task: '',
//         description: 'Task description',
//         files: [], 
//         createTime: new Date('2024-09-01T12:00:00'),
//         assignedTime: new Date('2024-09-02T10:00:00'),
//         workCompleteTime: new Date('2024-09-05T16:00:00'),
//         employeeComment: 'Employee comment',
//         managerComment: 'Manager comment',
//         createStatus: '', 
//         assignedStatus: '', 
//         workCompleteStatus: '',
//         createStatusTime: null, 
//         assignedStatusTime: null, 
//         workCompleteStatusTime: null, 
//       },
//     ],
//   });

//   const navigate = useNavigate();

//   const handleSaveChanges = () => {
//     setState((prevState) => {
//       const updatedTasks = prevState.tasks.map((task) => {
//         return {
//           ...task,
//           createStatusTime: task.createStatus ? new Date() : task.createStatusTime,
//           assignedStatusTime: task.assignedStatus ? new Date() : task.assignedStatusTime,
//           workCompleteStatusTime: task.workCompleteStatus ? new Date() : task.workCompleteStatusTime,
//         };
//       });

//       return { ...prevState, tasks: updatedTasks, isEditing: false };
//     });
//     alert('Changes saved!');
//   };

//   const handleSelectEmployee = (name) => {
//     setState((prevState) => ({ ...prevState, name }));
//   };

//   const formatDate = (date) => {
//     return date ? format(new Date(date), 'yyyy-MM-dd HH:mm') : 'N/A';
//   };

//   const handleLogout = () => {
//     navigate('/login'); 
//   };

//   const handleEditClick = () => {
//     setState((prevState) => ({ ...prevState, isEditing: true }));
//   };

//   const handleInputChange = (e, index, field) => {
//     const { value } = e.target;
//     const updatedTasks = [...state.tasks];
//     updatedTasks[index][field] = value;
//     setState((prevState) => ({ ...prevState, tasks: updatedTasks }));
//   };

//   const handleFileChange = (e, index) => {
//     const { files } = e.target;
//     const updatedTasks = [...state.tasks];
//     const fileNames = Array.from(files).map((file) => file.name); 
//     updatedTasks[index].files = fileNames;
//     setState((prevState) => ({ ...prevState, tasks: updatedTasks }));
//   };

//   const handleMobileNumberChange = (e) => {
//     const { value } = e.target;
//     if (/^\d*$/.test(value) && value.length <= 10) {
//       setState({ ...state, mobileNumber: value });
//     }
//   };

//   const handleTeamsClick = () => {
//     const chatUrl = `https://teams.microsoft.com/l/chat/0/0?users=${state.name}`; 
//     window.location.href = chatUrl; 
//   };

//   const handleRadioChange = (e, index, field) => {
//     const { value } = e.target;
//     const updatedTasks = [...state.tasks];
//     updatedTasks[index][field] = value;
//     setState((prevState) => ({ ...prevState, tasks: updatedTasks }));
//   };

//   const handleTaskClick = (taskId) => {
//     navigate(`/tasks/${taskId}`);
//   };

//   // Add this function to handle adding a new task
//   const handleAddTask = () => {
//     const newTask = {
//       id: state.tasks.length + 1, // Incrementing ID for simplicity
//       task: '',
//       gmail:"",
//       description: '',
//       files: [], 
//       createTime: new Date(),
//       assignedTime: null,
//       workCompleteTime: null,
//       employeeComment: '',
//       managerComment: '',
//       createStatus: '', 
//       assignedStatus: '', 
//       workCompleteStatus: '',
//       createStatusTime: null, 
//       assignedStatusTime: null, 
//       workCompleteStatusTime: null, 
//     };
//     setState((prevState) => ({ ...prevState, tasks: [...prevState.tasks, newTask] }));
//   };

//   const removeTask = ()=>{
//     console.log("remove")
//   }

//   const { name, email, mobileNumber, skills, selectedDate, tasks, isEditing } = state;

//   return (
//     <div className="admin-background">
//       <Container fluid>
//         <Row>
//           <Col md={3}>
//             <Sidebar onSelectEmployee={handleSelectEmployee} />
//           </Col>

//           <Col md={9}>
//             <div className="header">
//               <h1 className="head001">Admin Dashboard</h1>
//               <Button variant="danger" onClick={handleLogout} className="logout-btn">
//                 Logout
//               </Button>
//             </div>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group controlId="name">
//                   <Form.Label>Name: </Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter Name"
//                     value={name}
//                     readOnly
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="email">
//                   <Form.Label>Email: </Form.Label>
//                   <Form.Control
//                     type="email"
//                     placeholder="Enter Email"
//                     value={email}
//                     onChange={(e) => setState({ ...state, email: e.target.value })}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="mobileNumber">
//                   <Form.Label>Mobile Number: </Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter Mobile Number"
//                     value={mobileNumber}
//                     onChange={handleMobileNumberChange} 
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group controlId="skills">
//                   <Form.Label>Skills: </Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter Skills"
//                     value={skills}
//                     onChange={(e) => setState({ ...state, skills: e.target.value })}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Button variant="info" onClick={handleTeamsClick}>
//                   Teams
//                 </Button>
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col>
//                 <Form.Group>
//                   <Form.Label>Date:</Form.Label>
//                   <DatePicker
//                     selected={selectedDate}
//                     onChange={(date) => setState({ ...state, selectedDate: date })}
//                     dateFormat="dd-MM-yyyy"
//                     className="form-control"
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col>
//                 <Button variant="success" onClick={handleAddTask} className="mb-3">
//                   Add Task
//                 </Button>
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Task</th>
//                       <th>Email</th>
//                       <th>Description</th>
//                       <th>Files</th>
//                       <th>Create Date & Time</th>
//                       <th>Create Status</th>
//                       <th>Assigned Date & Time</th>
//                       <th>Assigned Status</th>
//                       <th>Complete Date & Time</th>
//                       <th>Complete Status</th>
//                       <th>Employee Comment</th>
//                       <th>Manager Comment</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {tasks.map((task, index) => (
//                       <tr key={task.id}>
//                         <td>
//                         <Button onClick={removeTask()} variant="secondary" className="ml-2">
//               Delete
//             </Button>
//                           {isEditing ? (
//                             <Form.Control
//                               type="text"
//                               value={task.task}
//                               onChange={(e) => handleInputChange(e, index, 'task')}
//                             />
//                           ) : (
//                             <a href="#" onClick={() => handleTaskClick(task.id)}>
//                               {index + 1}. {"Task"+task.task}  {/* Serial number added here */}
//                             </a>
//                           )}
//                         </td>
//                         <td>
//                           {isEditing ? (
//                             <Form.Control
//                               type="text"
//                               value={task.gmail}
//                               onChange={(e) => handleInputChange(e, index, 'Gmail')}
//                             />
//                           ) : (
//                             task.description
//                           )}
//                         </td>
//                         <td>
//                           {isEditing ? (
//                             <Form.Control
//                               type="text"
//                               value={task.description}
//                               onChange={(e) => handleInputChange(e, index, 'description')}
//                             />
//                           ) : (
//                             task.description
//                           )}
//                         </td>
//                         <td>
//                           {isEditing ? (
//                             <>
//                               <Form.Control
//                                 type="file"
//                                 multiple
//                                 onChange={(e) => handleFileChange(e, index)}
//                               />
//                               <div>
//                                 {task.files.map((file, i) => (
//                                   <div key={i}>{file}</div>
//                                 ))}
//                               </div>
//                             </>
//                           ) : (
//                             task.files.join(', ')
//                           )}
//                         </td>

//                         <td>
//                           <small>{formatDate(task.createStatusTime)}</small>
//                         </td>
//                         <td>
//                           <Form.Check
//                             type="radio"
//                             name={`createStatus-${index}`}
//                             label="Created"
//                             value="created"
//                             checked={task.createStatus === 'created'}
//                             onChange={(e) => handleRadioChange(e, index, 'createStatus')}
//                           />
//                         </td>

//                         <td>
//                           <small>{formatDate(task.assignedStatusTime)}</small>
//                         </td>
//                         <td>
//                           <Form.Check
//                             type="radio"
//                             name={`assignedStatus-${index}`}
//                             label="Assigned"
//                             value="completed"
//                             checked={task.assignedStatus === 'completed'}
//                             onChange={(e) => handleRadioChange(e, index, 'assignedStatus')}
//                           />
//                         </td>

//                         <td>
//                           <small>{formatDate(task.workCompleteStatusTime)}</small>
//                         </td>
//                         <td>
//                           <Form.Check
//                             type="radio"
//                             name={`workCompleteStatus-${index}`}
//                             label="Completed"
//                             value="completed"
//                             checked={task.workCompleteStatus === 'completed'}
//                             onChange={(e) => handleRadioChange(e, index, 'workCompleteStatus')}
//                           />
//                         </td>

//                         <td>
//                           {isEditing ? (
//                             <Form.Control
//                               type="text"
//                               value={task.employeeComment}
//                               onChange={(e) => handleInputChange(e, index, 'employeeComment')}
//                             />
//                           ) : (
//                             task.employeeComment
//                           )}
//                         </td>

//                         <td>
//                           {isEditing ? (
//                             <Form.Control
//                               type="text"
//                               value={task.managerComment}
//                               onChange={(e) => handleInputChange(e, index, 'managerComment')}
//                             />
//                           ) : (
//                             task.managerComment
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </Col>
//             </Row>

//             <Button variant="primary" onClick={handleSaveChanges}>
//               Save Changes
//             </Button>
//             <Button variant="secondary" onClick={handleEditClick} className="ml-2">
//               Edit
//             </Button>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Admin;
