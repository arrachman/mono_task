import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List } from 'immutable';
import { Link } from 'react-router-dom';
/* Styles */
import { Box, Breadcrumb, BreadcrumbItem, Row, Container, Col, Table, BoxTitle, Checkbox, Badge, Button, Dropdown, DropdownItem, Collapse, Form,FormGroup, Input, Select } from '../styles';
/* Styles */
const Insert = (path, data, target) => {
    const promise = new Promise ((resolve, reject) => {
        let dataHeader = {headers: {
            'Authorization': `Bearer 123`,
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }};
        axios({method:'POST', url:`http://localhost:15001/${path}`, data}, dataHeader)
        .then((result)=> {
            resolve({data:result.data, target});
        }, (err) => {
            reject(err);
        }).then(() => {
            
        })
    });

    return promise;
};

const Delete = (path, target) => {
    const promise = new Promise ((resolve, reject) => {
        let dataHeader = {headers: {
            'Authorization': `Bearer 123`,
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }};
        axios({method:'DELETE', url:`http://localhost:15001/${path}`}, dataHeader)
        .then((result)=> {
            resolve({data:result.data, target});
        }, (err) => {
            reject(err);
        }).then(() => {
            
        })
    });

    return promise;
};

const Edit = (path, data, target) => {
    const promise = new Promise ((resolve, reject) => {
        let dataHeader = {headers: {
            'Authorization': `Bearer 123`,
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }};
        axios({method:'put', url:`http://localhost:15001/${path}`, data}, dataHeader)
        .then((result)=> {
            resolve({data:result.data, target});
        }, (err) => {
            reject(err);
        }).then(() => {
            
        })
    });

    return promise;
};

const Get = (path, target) => {
    const promise = new Promise ((resolve, reject) => {
        let dataHeader = {headers: {
            'Authorization': `Bearer 123`,
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }};
        axios({method:'get', url:`http://localhost:15001/${path}`}, dataHeader)
        .then((result)=> {
            resolve({data:result.data, target});
        }, (err) => {
            reject(err);
        }).then(() => {
            
        })
    });

    return promise;
}

class ListUser extends React.Component 
{
    constructor(props, context) 
    {
      super(props, context);
      this.state = {
          task: '', 
          mode: 'add',
          editId: 0,
          data: List([])};


      let param = this.props.location.pathname;

      let arrParam = param.split('/')
      this.user = arrParam[arrParam.length-1] ? arrParam[arrParam.length-1] : ''
      this.userId = arrParam[arrParam.length-2] ? arrParam[arrParam.length-2] : ''
      const path = `api/task`
      Get(path, 'show').then(this.API_Result);  


    }

    API_Result = (param) =>
    {
        const {target} = param;
        const {success, data} = param.data;
        if(success)
        {
        switch(target)
        {
            case 'show':
            let dataTable = data;
            this.setState({data:dataTable});
            break;
            case 'insert':
                            
                const path = `api/task`
                Get(path, 'show').then(this.API_Result);  
                break;
        }
        }
        else
        {
            switch(target)
            {
                case 'edit':
                    
                     this.setState({mode: 'add', task: ''})
                     Get(`api/task`, 'show').then(this.API_Result);  
                    break;
                case 'delete':
                case 'insert':
                    const path = `api/task`
                    Get(path, 'show').then(this.API_Result);  
                    break;
            }
        this.setState({
            data: List([])
        });
        }
    }

    render() 
    {
        let users = this.state.data;
        
        return(
            <div>
                <div className="title">
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <a href="#!">Programmer Test</a>
                        </BreadcrumbItem>
                        <BreadcrumbItem isActive={true}>
                        List Task
                        </BreadcrumbItem>
                    </Breadcrumb>
                </div>

                <div className="body">
                    <Container>
                        <Row>

                            {/* content form */}
                            {(this.user != "" || this.state.mode == "edit") &&
                            <Box xs={12} sm={12}>
                                <Form handleSubmit={(e) => { 
                                    e.preventDefault();
                                    const path = 'api/task';
                                    const formData = new FormData();
                            
                                    this.state.mode == "add" ?
                                    Insert('api/assign', {user:this.user, tasks: [this.state.task]}, 'insert').then(this.API_Result)
                                    :
                                    Edit(path + "/" + this.state.editId, {task:this.state.task} , 'edit').then(this.API_Result)

                                }}>
                                    <FormGroup>User {this.user}
                                        <Input 
                                            value={this.state.task}
                                            required={true}
                                            type="text" 
                                            handleChange={(e) => {this.setState({task: e.target.value});  }}/>
                                    </FormGroup>
                                    {this.state.mode == "add" ? 
                                    <FormGroup>
                                        <Button type="submit" label="Add Task" isFull={true}/>
                                    </FormGroup>
                                    :
                                    <FormGroup>
                                        <Button type="submit" label="Edit" />
                                        <span onClick={()=> {this.setState({mode:'add', task: ''})}}>
                                        <Button type="button" label="Cancel" /></span>
                                    </FormGroup>
                                    }
                                </Form>
                            </Box>
                            }
                            <Box sm={12}>
                                <BoxTitle icon="fa fa-list" label="List User"/>
                                
                                <Table isResponsive={true}>
                                    <thead>
                                        <tr>
                                            <th>
                                                Id
                                            </th>
                                            <th>
                                                User
                                            </th>
                                            <th>
                                                Task
                                            </th>
                                            <th>
                                                Edit
                                            </th>
                                            <th>
                                                Delete
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { users.map((data, index) =>(
                                            <tr key={index}>
                                                <td>
                                                    { data.id }
                                                </td>
                                                <td>
                                                    { data.user }
                                                </td>
                                                <td >
                                                    { data.task }
                                                </td>
                                                <td onClick={() => {this.setState({mode: 'edit', editId: data.id, task: data.task})  }}>
                                                    Edit
                                                </td>
                                                <td onClick={() => {Delete('api/task/' + data.id, 'delete').then(this.API_Result);  }}>
                                                    Delete
                                                </td>
                                            </tr>
                                        )) }
                                    </tbody>
                                </Table>
                            </Box>
                        </Row>
                    </Container>
                </div>
            </div>
        );
  }
}

export default ListUser;