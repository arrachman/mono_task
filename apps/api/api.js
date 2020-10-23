const userPost = async(req) => {
    const result = help.validator(req.body, {'Users' : 'required'});
    if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);

    const user = req.body.Users
    const db = new help.ModelsDB('tbl_user');
    for(const key in user)
    {
        const getData = user[key];

        const insertData = await db.insertData('tbl_user', {id:0, user:getData});
        if(!insertData.success) return res.fail(insertData.message, 406, insertData.messageDev, __line, __filename);
    }

    return res.noContent();
}

const user = async(req) => {
    let db = new help.ModelsDB('tbl_user');
    res.data = await db.getData()
    return res.success();
}

const userDeleteWithTask = async(req) => {
    let db = new help.ModelsDB('tbl_user');
    let updateData = await db.deleteData('tbl_user', 'id', req.params.id);
    if(!updateData.success) return res.fail(updateData.message, 406, updateData.messageDev, __line, __filename);

    
     updateData = await db.deleteData('tbl_tasks', 'id_user', req.params.id);
    if(!updateData.success) return res.fail(updateData.message, 406, updateData.messageDev, __line, __filename);

    return res.noContent();
}

const userPut = async(req) => {
    const result = help.validator(req.body, {'user' : 'required'});
    if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);

    const user = {user: req.body.user}
    const db = new help.ModelsDB('tbl_user');
    const updateData = await db.updateData('tbl_user', 'id', req.params.id, user);
    if(!updateData.success) return res.fail(updateData.message, 406, updateData.messageDev, __line, __filename);

    return res.noContent();
}

const task = async(req) => {
    let db = new help.ModelsDB('tbl_user');
    db.select = 'tbl_tasks.id, tbl_user.user, tbl_tasks.task'
    db.arrJoin = [['tbl_tasks', 'tbl_tasks.id_user', '=', 'tbl_user.id']]
    res.data = await db.getData()
    return res.success();
}

const assign = async(req) => {
    const result = help.validator(req.body, {'user' : 'required', 'tasks' : 'required'});
    if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);

    const user = req.body.user
    const tasks = req.body.tasks
    let db = new help.ModelsDB('tbl_user');
    for(const key in tasks)
    {
        let id = await db.getDataById('user', user);
        if(id && id.length > 0) {
            const insertData = await db.insertData('tbl_tasks', {id_user:id[0].id, task:tasks[key]});
            // res.data = insertData.success ? await db.checkDataById(this.tableName, 'id', req.body[this.primaryKey]) : '';
            if(!insertData.success) return res.fail(insertData.message, 406, insertData.messageDev, __line, __filename);
        }
    }
    return res.noContent();
}

const common = async(req) => {
    let result = ''
    if(req && req.query)
        result = help.validator(req.query, {
            'user'              : 'required',
        });
    if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);

    const user = JSON.parse(req.query.user)
    let db = new help.ModelsDB('tbl_user');
    let data = []
    for(const key in user)
    {
        db.select = 'task'
        db.arrJoin = [['tbl_tasks', 'tbl_tasks.id_user', '=', 'tbl_user.id']]
        let task = await db.getData("user = '" + user[key] + "'");
        if(task && task.length > 0) {
            for(const i in task)
            {
                data.push(task[i].task)
            }
        }
    }
    return {send: {tasks: data}, status: 200};
}

const taskPut = async(req) => {
    const result = help.validator(req.body, {'task' : 'required'});
    if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);

    const task = {task: req.body.task}
    const db = new help.ModelsDB('tbl_tasks');
    const updateData = await db.updateData('tbl_tasks', 'id', req.params.id, task);
    if(!updateData.success) return res.fail(updateData.message, 406, updateData.messageDev, __line, __filename);

    return res.noContent();
}

const taskDelete = async(req) => {
    const db = new help.ModelsDB('tbl_tasks');
    const updateData = await db.deleteData('tbl_tasks', 'id', req.params.id);
    if(!updateData.success) return res.fail(updateData.message, 406, updateData.messageDev, __line, __filename);

    return res.noContent();
}
    
module.exports = {
    app: app => {
        
        //http://localhost:15001/api/user
        app.post('/api/user', async(req, result) => {
            let respond
            try {
                respond = await userPost(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });
        
        //http://localhost:15001/api/user
        app.get('/api/user', async(req, result) => {
            let respond
            try {
                respond = await user(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });

        //http://localhost:15001/api/user/:id
        app.delete('/api/user/:id', async(req, result) => {
            let respond
            try {
                respond = await userDeleteWithTask(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });

        //http://localhost:15001/api/user/:id
        app.put('/api/user/:id', async(req, result) => {
            let respond
            try {
                respond = await userPut(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });
        
        
        //http://localhost:15001/api/task
        app.get('/api/task', async(req, result) => {
            let respond
            try {
                respond = await task(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });
        
        //http://localhost:15001/api/assign
        app.post('/api/assign', async(req, result) => {
            let respond
            try {
                respond = await assign(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });
        
        //http://localhost:15001/api/assign
        app.post('/api/tasks/common', async(req, result) => {
            let respond
            try {
                respond = await common(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });
        
        //http://localhost:15001/api/task/:id
        app.put('/api/task/:id', async(req, result) => {
            let respond
            try {
                respond = await taskPut(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });
        
        //http://localhost:15001/api/task/:id
        app.delete('/api/task/:id', async(req, result) => {
            let respond
            try {
                respond = await taskDelete(req);
            }
            catch (err) {
                respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), __line, __filename)
            }
            result.status(respond.status).send(respond.send);
        });
    }    
};