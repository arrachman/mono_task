
class F1_Master  
{
    constructor() 
    {
        // table identity
        this.tableName = '';
        this.primaryKey = '';
    
        // parameter for select data
        this.select = '';
        this.selectFormatDate = '';
    
        // Parameter for post data
        this.validatorPost = '';
        this.dataPost = '';
    
        // Parameter for update data
        this.validatorUpdate = '';
        this.dataUpdate = '';

        this.setParam = param => {
            this.tableName = param.tableName;
            this.primaryKey = param.primaryKey;
        
            this.select = param.select;
            this.selectFormatDate = param.selectFormatDate;
        
            this.validatorPost = param.validatorPost;
            this.dataPost = param.dataPost;
        
            this.validatorUpdate = param.validatorUpdate;
            this.dataUpdate = param.dataUpdate;
        }

        this.showSearch = async(req, table, select, selectDate, title, header) => {
            const result = help.validatorGet(req);
            if(!result.success)
                return res.fail(result.message, 406, result.messageDev, __line, __filename);
        
            const param = JSON.parse(req.query.param);
            res.target = param.target; 
        
            let filter = param.filter == '' ? '' : param.filter;
            if(param.filterSearch != '') {
                var filter2 = '';

                if(param.column == 'All') {
                    for(const key in this.header) {
                        filter += filter == '' ? '' : ' OR ';
                        filter += help.caseOperator(param.operator,header[key][0], param.filterSearch);
                    }
                }
                else
                {
                    filter  += help.caseOperator(param.operator, param.column, param.filterSearch);
                }

                filter = (filter2 != '' && filter != '') ? '(' + filter + ') AND (' + filter2 + ')' : filter;
            }
            
            let db = new help.ModelsDB(table);
            db.select           = select;
            db.selectFormatDate = selectDate;
            const data = await db.getData(param.filter, param.groupBy, param.orderBy, param.pageLimit, param.pageNumber);
        
            res.data = {};
            res.data.title = title;
            res.data.header = header;
            res.data.data = data;

            return res.success();
        }

        this.show = async(req, varParam) => {
            varParam && this.setParam(varParam)
            const result = help.validatorGet(req);
            if(!result.success)
                return res.fail(result.message, 406, result.messageDev, __line, __filename);
        
            const param = JSON.parse(req.query.param);
            res.target = param.target; 
        
            let db = new help.ModelsDB(this.tableName);
            db.select           = this.select;
            db.selectFormatDate = this.selectFormatDate;
            res.data = await db.getData(param.filter, param.groupBy, param.orderBy, param.pageLimit, param.pageNumber);

            return res.success();
        }

        this.showById = async(req, varParam) => {
            varParam && this.setParam(varParam)
            const param = JSON.parse(req.query.param);
            res.target = param.target; 
        
            const db = new help.ModelsDB(this.tableName);
            db.selectFormatDate = this.selectFormatDate;
            res.data = await db.getDataById(this.primaryKey, req.params.id);
        
            return res.success();
        }

        this.insert = async(req, varParam) => {
            varParam && this.setParam(varParam)
            const result = help.validator(req.body, this.validatorPost);
            if(!result.success) return res.fail(result.message, 406, result.messageDev, __line, __filename);

            const param = JSON.parse(req.query.param);
            res.target = param.target; 
            let db = new help.ModelsDB(this.tableName);
            let checkById = await db.checkDataById(this.tableName, this.primaryKey, req.body[this.primaryKey]);
            if(checkById.success && !help.isEmpty(checkById.message)) return res.fail("Data already exiss '" + req.body[this.primaryKey] + "'", 406, null, __line, __filename);
        
            const arrDataPost = help.strToArray(this.dataPost);
            const setDataPost = {};
            for(const key in arrDataPost)
            {
                const getData = arrDataPost[key];
                const value = req.body[getData];

                setDataPost[getData] = (help.isEmpty(value) && value != 0)?'':value;
            }
            
            const insertData = await db.insertData(this.tableName, setDataPost);
            res.data = insertData.success ? await db.checkDataById(this.tableName, this.primaryKey, req.body[this.primaryKey]) : '';
            if(!insertData.success) return res.fail(insertData.message, 406, insertData.messageDev, __line, __filename);
            
            return res.success();
        }
    
        this.update = async(req, varParam) => {
            varParam && this.setParam(varParam)
            const result = help.validator(req.body, this.validatorUpdate);
            if(!result.success)
                return res.fail(result.message, 406, result.messageDev, __line, __filename);

            const param = JSON.parse(req.query.param);
            res.target = param.target; 
        
            let db = new help.ModelsDB(this.tableName);
            let checkById = await db.checkDataById(this.tableName, this.primaryKey, req.params.id);
            if(checkById.success && help.isEmpty(checkById.message))
                return res.fail("Data not found '" + req.params.id + "'", 406, null, __line, __filename);
        
            const arrDataUpdate = help.strToArray(this.dataUpdate);
            const setDataUpdate = {};
            for(const key in arrDataUpdate)
            {
                const getData = arrDataUpdate[key];
                const value = req.body[getData];

                setDataUpdate[getData] = help.isEmpty(value)?'':value;
            }
            const updateData = await db.updateData(this.tableName, this.primaryKey, req.params.id, setDataUpdate);
            if(updateData.success)
                res.data = await db.checkDataById(this.tableName, this.primaryKey, req.params.id);
            else
                return res.fail(updateData.message, 406, updateData.messageDev, __line, __filename);
            
            return res.success();
        }
        
        this.delete = async(req, varParam) => {
            varParam && this.setParam(varParam)
            const param = JSON.parse(req.query.param);
            res.target = param.target; 
        
            const db = new help.ModelsDB(this.tableName);
            let checkById = await db.checkDataById(this.tableName, this.primaryKey, req.params.id);
            if(checkById.success && help.isEmpty(checkById.message))
                return res.fail("Data not found '" + req.params.id + "'", 406, null, __line, __filename);
        
            const deleteData = await db.deleteData(this.tableName, this.primaryKey, req.params.id);
            if(!deleteData.success)
                return res.fail(deleteData.message, 406, deleteData.messageDev, __line, __filename);
            
            return res.success();
        }
    }
}

module.exports = { F1_Master };