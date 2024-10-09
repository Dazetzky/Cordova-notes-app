document.addEventListener('deviceready', onDeviceReady, false)

var db = null;

window.current = {
    selected_tenant_item: -1,
    max_tenant_item: 0
};

document.getElementById("task-data").onclick = function(e) {
    if (e.target.classList.value === "taskLow" || e.target.classList.value === "taskMiddle" || e.target.classList.value === "taskHigh") {
        current.selected_tenant_item = e.target.id;
        console.log(current.selected_tenant_item + "test");
    }
}

document.getElementById("delete-button_").onclick = function(e) {
    if(current.selected_tenant_item != -1) {
        document.getElementById(current.selected_tenant_item).remove();
        console.log(current.selected_tenant_item);
        DeleteScheduleFromDB();
        current.selected_tenant_item = -1;
    }
}

function DeleteScheduleFromDB(){
    var id = current.selected_tenant_item;
    db.transaction(function(tx){
        tx.executeSql('DELETE FROM mytable where id='+id)
    });
}

document.getElementById("boobs").onclick = function() {
    db = window.sqlitePlugin.openDatabase({
        name : 'data.db',
        location: 'default'
    });

    var scheduleinput = document.getElementById("nameInput");
    var datepickinput = document.getElementById("dateTimeInput");
    var priminput = document.getElementById("notesInput");
    var importanceinput = document.getElementById("importanceSelect");

    var value = importanceinput.value;
    var texImportance = importanceinput.options[importanceinput.selectedIndex].text;

    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO mytable (schedule, date, prim, importance, time) VALUES (?, ?, ?, ?, ?)', [scheduleinput.value, datepickinput.value, priminput.value, texImportance, ""],
        function(tx, res) 
        {
            console.log('Record added!');
            InitSchedule();
        },
        function(tx, error) {
            console.log('Error adding record: ' + error.message);
        });
    });
}

function onDeviceReady() {
    db = window.sqlitePlugin.openDatabase({
        name : 'data.db',
        location: 'default'
    });

    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS mytable (id integer primary key, schedule text, date text, time text, prim text, importance)', [],
        function(tx, res) {
            console.log('Table created!');
        },
        function(tx, error) {
            console.log('Error creating table: ' + error.message);
        });
    });
    InitSchedule()
}

function InitSchedule(){
    let datep = document.getElementById("datepicker");
    let search = document.getElementById("search");
    let filt = 0;
    current.max_tenant_item = 0;

    if(search != null && datep != null) {
        if(search.value == "" && datep.value == ""){
            filt = 1;
        }
    } 
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM mytable', [],
        function(tx, res) {
            var len = res.rows.length;
            for (var i = 0; i < len; i++) {
                if((datep.value == "" && search.value=="") || (datep.value == res.rows.item(i).date && res.rows.item(i).schedule.includes(search.value)) || (datep.value == res.rows.item(i).date && search.value == "") || (datep.value == "" && res.rows.item(i).schedule.includes(search.value)))
                {
                    let li = document.createElement("div");

                    if(res.rows.item(i).importance == "Низкая") {
                        li.className = 'taskLow';
                        }
                    else if (res.rows.item(i).importance == "Средняя") {
                        li.className = 'taskMiddle';
                        }
                    else if (res.rows.item(i).importance == "Высокая") {
                        li.className = 'taskHigh';
                        }
                    
                    let ul = document.getElementById("task-data")
                    ul.appendChild(li);
    
                    let h3 = document.createElement("h3");
                    h3.innerText = res.rows.item(i).schedule
                    li.appendChild(h3);
    
                    let p1 = document.createElement("p");
                    p1.innerText = res.rows.item(i).date
                    li.appendChild(p1);
    
                    let p2 = document.createElement("p");
                    p2.innerText = res.rows.item(i).time
                    li.appendChild(p2);
    
                    let p3 = document.createElement("p");
                    p3.innerText = res.rows.item(i).prim
                    li.appendChild(p3);

                    li.id = res.rows.item(i).id
                }
            }
        },
        function(tx, error) {
            console.log('Error creating table: ' + error.message);
        });
    });
}

function RemoveSchedule() {
    let ul = document.getElementById("task-data")

    while( ul.firstChild ){
        ul.removeChild( ul.firstChild );
    }
}

document.getElementById("datepicker").onchange = function(){
    RemoveSchedule();
    InitSchedule();
}
    
document.getElementById("search").onchange = function(){
    RemoveSchedule();
    InitSchedule();
}

function OnChangeDate()
{
    RemoveSchedule();
    InitSchedule();
}

function onChangeSearcher()
{
    RemoveSchedule();
    InitSchedule();
}