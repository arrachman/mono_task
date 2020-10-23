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
          user: '', 
          mode: 'add',
          editId: 0,
          data: List([])};

      const path = `api/user`
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
                            
                const path = `api/user`
                Get(path, 'show').then(this.API_Result);  
                break;
        }
        }
        else
        {
            switch(target)
            {
                case 'edit':
                    
                     this.setState({mode: 'add', user: ''})
                     Get(`api/user`, 'show').then(this.API_Result);  
                    break;
                case 'delete':
                case 'insert':
                    const path = `api/user`
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
                        List User
                        </BreadcrumbItem>
                    </Breadcrumb>
                </div>

                <div className="body">
                    <Container>
                        <Row>

                            {/* content form */}
                            <Box xs={12} sm={12}>
                                <Form handleSubmit={(e) => { 
                                    e.preventDefault();
                                    const path = 'api/user';
                                    const formData = new FormData();
                            
                                    this.state.mode == "add" ?
                                    Insert(path, {Users:[this.state.user]}, 'insert').then(this.API_Result)
                                    :
                                    Edit(path + "/" + this.state.editId, {user:this.state.user} , 'edit').then(this.API_Result)

                                }}>
                                    <FormGroup>User
                                        <Input 
                                            value={this.state.user}
                                            required={true}
                                            type="text" 
                                            handleChange={(e) => {this.setState({user: e.target.value});  }}/>
                                    </FormGroup>
                                    {this.state.mode == "add" ? 
                                    <FormGroup>
                                        <Button type="submit" label="Add" isFull={true}/>
                                    </FormGroup>
                                    :
                                    <FormGroup>
                                        <Button type="submit" label="Edit" />
                                        <span onClick={()=> {this.setState({mode:'add', user: ''})}}>
                                        <Button type="button" label="Cancel" /></span>
                                    </FormGroup>
                                    }
                                </Form>
                            </Box>
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
                                                Add Task
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
                                        { users.map((user, index) =>(
                                            <tr key={index}>
                                                <td>
                                                    { user.id }
                                                </td>
                                                <td>
                                                    { user.user }
                                                </td>
                                                <td >
                                                <Link to={`/programmer-test/list-task/${user.id}/${user.user}`}>Add Task</Link>
                                                </td>
                                                <td onClick={() => {this.setState({mode: 'edit', editId: user.id, user: user.user})  }}>
                                                    Edit
                                                </td>
                                                <td onClick={() => {Delete('api/user/' + user.id, 'delete').then(this.API_Result);  }}>
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