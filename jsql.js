/**
 *@author Nguyen tan hau
 *@param string from server
 *@return JSON or string
 * */

function parseJSON(json) {
    try {
        var x = JSON.parse(json);
        var a = x.result;
        return a;
    } catch (err) {
        return json;
    }
}


/**
 *@param statement
 *@param key
 *
 *if(Key is exits) { excute}else{ return "Key don't not exits}
 *@return String status. If excute statement select, we will return to you list Object
 *
 * */
function excute(statement, key) {
    var ser = "https://jsql.herokuapp.com/DB/ExcuteQuery?";
    var url = ser + "st=" + statement + "&key=" + key;
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", url, false);
    xhReq.send();
    var serverResponse = xhReq.responseText;
    return parseJSON(serverResponse);
}

/**
 *@function chainging
 *@return query
 * */

var CreateJSQL = function (key) {
    var str = "";
    /**
     * @implements add row to db
     * */
    var Insert = function (table) {
        str += "insert into " + table;
        return this;
    };
    var Column = function (listCol) {
        str += "(";
        str += listCol.join(',');
        str += ")";
        return this;
    };
    var Values = function (listValue) {
        str += " values(";
        str += listValue.join(',');
        str += ")";
        return this;
    };
    var AddTo = function (table, listValue) {
        str += "insert into " + table + " values(";
        str += listValue.join(',');
        str += ")";
        return this;
    };

    var AddTable = function (tableName, listCol) {
        str += "create table " + tableName + "(";
        str += listCol.join(',');
        str += ");";
        return this;
    };

    var AddPrimaryKey = function (ListKey) {
        var key = ListKey.join(',');
        str = str.substr(0, str.indexOf(');'));
        str += ", primary key (" + key + "));";
        return this;
    };

    var OnDelete = function () {
        str = str.substr(0, str.indexOf(');'));
        str += " on delete cascade );";
        return this;
    };
    var OnUpdate = function () {
        str = str.substr(0, str.indexOf(');'));
        str += " on update cascade );";
        return this;
    };

    var AddForeignKey = function (keySrc, tableDest, keyDest) {
        str = str.substr(0, str.indexOf(');'));
        str += ", foreign key (" + keySrc + ") references " + tableDest + "(" + keyDest + "));";
        return this;
    };

    /**
     * ---------------------------------------------------------------------
     * @implements selectCol
     * */
    var Select = function (table, colSelectList) {
        str += "select ";
        if (colSelectList === null || !colSelectList) {
            str += " * from " + table;
            return this;
        }
        str += colSelectList.join(',');
        str += " from " + table + " ";
        return this;
    };

    var SelectIf = function (table, ListCondition, operation) {
        Select(table, null);
        Where(ListCondition, operation);
        return this;
    };


    var Top = function (numberRow, table) {
        str += " limit " + numberRow;
        return this;
    };

    /**
     * ---------------------------------------------------------
     * @implements delete statement
     * */
    var DeleteIf = function (table, ListCondition, operation) {
        if (!ListCondition || ListCondition === null) {
            return this;
        }
        str += "delete from " + table;
        Where(ListCondition, operation);
        return this;
    };

    var Delete = function (table) {
        str += "delete from " + table;
        return this;
    };


    /**
     * ---------------------------------------------------------------------
     * @implements wherestatement
     * */

    var Where = function (ListCondition, operation) {
        if (ListCondition === null || !ListCondition) {
            return this;
        }
        if (!operation || operation === null) {
            operation = " and ";
        }
        str += " where ";
        str += ListCondition.join(" " + operation + " ");

        return this;
    };


    var If = function (table, ListCondition, operation) {
        str += "select * from " + table;
        Where(ListCondition, operation);
        return this;
    };


    /**
     * -------------------------------------------------------------------
     * @implements updatestatement // WHERE [condition];
     * */


    var Update = function (table, ListSetValue) {
        str = "update " + table + " set ";
        str += ListSetValue.join(',');
        return this;
    };

    var UpdateIf = function (table, ListSetValue, ListCondition, operation) {
        Update(table, ListSetValue);
        Where(ListCondition, operation);
        return this;
    };
    /**
     * --------------------------------------------------------------------
     * @implements orderstatement
     * */
    var GroupBy = function (ListColumn) {
        str += " group by " + ListColumn.join(',');
        return this;
    };

    var OrderBy = function (ListColumn, Option) {
        if (!Option || Option === null) {
            str += " order by " + ListColumn.join(',') + " asc ";
        } else {
            str += " order by " + ListColumn.join(',') + " " + Option + " ";
        }
        return this;
    };
    var Count = function (ListCountTo) {
        if (ListCountTo === null || !ListCountTo) {
            str = str.replace('select', 'select count(*), ');
        } else {
            str = str.replace('select', 'select count(' + ListCountTo.join(',') + '), ');
        }
        return this;
    };

    var Having = function (Condition) {
        str += " having " + Condition + " ";
        return this;
    };

    var JOINTwoTable = function (Table1, Table2, JoinOn) {
        str += "select tb1.*,tb2.* " + " from " + " tb1 " + Table1 + " join tb2 " + Table2 + " on tb1." + JoinOn + "=tb2." + JoinOn;
        return this;
    };
    /**
     * --------------------------------------------------------------------
     * @implements excuteQuery
     * */
    var ExcuteQuery = function () {
        var ser = "https://jsql.herokuapp.com/DB/ExcuteQuery?";
        var url = ser + "st=" + CreateQuery() + "&key=" + key;
        var xhReq = new XMLHttpRequest();
        xhReq.open("GET", url, false);
        xhReq.send();
        var serverResponse = xhReq.responseText;
        return parseJSON(serverResponse);
    };

    var CreateARandomQuery = function (SubQuery) {
        str += SubQuery;
        return this;
    };

    var CreateQuery = function () {
        return str;
    };

    /**
     * @deprecated
     * */
    var ExcuteQueryToString = function () {
        var ser = "https://jsql.herokuapp.com/DB/ExcuteQuery?";
        var url = ser + "st=" + CreateQuery() + "&key=" + key;
        var xhReq = new XMLHttpRequest();
        xhReq.open("GET", url, false);
        xhReq.send();
        var serverResponse = xhReq.responseText;
        return parseJSON(serverResponse).toString();
    };
    return {
        // add, insert
        Insert: Insert,
        Column: Column,
        Values: Values,
        AddTo: AddTo,
        AddTable: AddTable,
        AddPrimaryKey: AddPrimaryKey,
        AddForeignKey: AddForeignKey,
        OnDelete: OnDelete,
        OnUpdate: OnUpdate,

        // update
        Update: Update,
        UpdateIf: UpdateIf,

        // delete
        Delete: Delete,
        DeleteIf: DeleteIf,

        // select
        Select: Select,
        SelectIf: SelectIf,
        Top: Top,

        // condition
        Where: Where,
        If: If,

        // order
        Count: Count,
        OrderBy: OrderBy,
        GroupBy: GroupBy,
        JoinTwoTable: JOINTwoTable,
        CreateARandomQuery: CreateARandomQuery,
        Having:Having,
        CreateQuery: CreateQuery,
        ExcuteQuery: ExcuteQuery,
        ExcuteQueryToString: ExcuteQueryToString
    }
};
//

var Account = function (username, pass1, pass2) {
    var command = "";
    var Lock = function () {
        command = "lock";
        return this;
    };

    var Unlock = function () {
        command = "unlock";
        return this;
    };

    var Information = function () {
        command = "info";
        return this;
    };

    var Register = function () {
        command = "register";
        return this;
    };

    var ExcuteAcc = function () {
        var ser = "https://jsql.herokuapp.com/ACC/ExcuteACC?";
        var url = ser + "cmd=" + command + "&username=" + username + "&pass1=" + pass1 + "&pass2=" + pass2;
        var xhReq = new XMLHttpRequest();
        xhReq.open("GET", url, false);
        xhReq.send();
        var serverResponse = xhReq.responseText;
        return parseJSON(serverResponse);
    };
    return {
        Lock: Lock, Unlock: Unlock, Information: Information, Register: Register, ExcuteAcc: ExcuteAcc
    }
};