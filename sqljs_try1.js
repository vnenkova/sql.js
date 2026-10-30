document.addEventListener('DOMContentLoaded', function () {
	async function main() {
            //Вар 1 - с хардкодната база--------------------------------------------

            const SQL = await initSqlJs({ //initiazling the library
                locateFile: file =>
                    `https://sql.js.org/dist/${file}`
            });

            const db1 = new SQL.Database(); //new empty db created in memory
            
            db1.run(`
                CREATE TABLE students (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    age INTEGER,
                    course TEXT
                );
            `);

            db1.run(`
                INSERT INTO students (name, age, course)
                VALUES
                    ('Alice', 21, 'Web Development'),
                    ('Bob', 23, 'Databases'),
                    ('Charlie', 20, 'JavaScript'),
                    ('Meghan', 23, "Web Design"),
                    ("Lilly", 24, "Cybersecurity");
            `);

            const hardcodedQuery = `SELECT name, age, course FROM students WHERE age >= 21;`;

            const hardcodedTextarea = document.querySelector('#sql_query_hardcoded');
            hardcodedTextarea.value = hardcodedQuery;

            const results = db1.exec(hardcodedQuery);

            const resultsContainer1 = document.querySelector('#results1');

            if (results.length === 0) {
              resultsContainer.innerText = "Няма налични резултати.";
              return;
            }

            const table = document.createElement('table');
            table.className = "table table-pink table-bordered table-striped table-hover";

            const responsiveDiv = document.createElement('div');
            responsiveDiv.classList.add('table-responsive');

            const thead = document.createElement('thead');
            thead.className = "table-pink-header"

            const headerRow = document.createElement('tr');
            
            results[0].columns.forEach(column => {
              const th = document.createElement('th');

              th.innerText = column;
              headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');

            results[0].values.forEach(row => {
              const tr = document.createElement('tr');

              row.forEach(value => {
                const td = document.createElement('td');
                td.innerText = value === null ? "NULL" : String(value);

                tr.appendChild(td);
              });

              tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            responsiveDiv.appendChild(table);
            resultsContainer1.appendChild(responsiveDiv);


            //Вар. 2 - с импортирана БД--------------------------------------------------------
            let db2 = null;

            const fileInput = document.querySelector('#db_file');
            fileInput.addEventListener('change', function () {
                const file = this.files[0];

                if (!file) {
                    return;
                }

                const reader = new FileReader();
                //what happens when reading the file finishes:
                reader.onload = function () {
                    const Uints = new Uint8Array(reader.result);
                    db2 = new SQL.Database(Uints);
                }

                //start reading the file
                reader.readAsArrayBuffer(file);
            });

            const dbErrorContainer = document.querySelector('#missingDbErrorContainer');
            const sqlQueryTextarea = document.querySelector('#sql_query');
            const resultsContainer2 = document.querySelector('#results2');

            document.querySelector('#run_query').addEventListener('click', function () {
                if (!db2) {
                    dbErrorContainer.innerText = "Моля, първо прикачете файл с БД!";
                    fileInput.classList.add('is-invalid');
                } else {
                    dbErrorContainer.innerText = "";
                    fileInput.classList.remove('is-invalid');

                    if (sqlQueryTextarea.value == "") {
                        dbErrorContainer.innerText = "Моля, въведете заявка за изпълнение!";
                        sqlQueryTextarea.classList.add('is-invalid');
                    } else {
                       resultsContainer2.classList.remove('d-none');
                       sqlQueryTextarea.classList.remove('is-invalid');  

                       const query = sqlQueryTextarea.value;
                       const results_sqlite =  db2.exec(query);

                       // console.log(results_sqlite);

                       if (results_sqlite.length === 0) {   
                        resultsContainer2.innerText = "Няма налични резултати.";
                        return;
                       }

                       const table_sqlite = document.createElement('table');
                       const responsiveDiv_sqlite = document.createElement('div');

                       responsiveDiv_sqlite.classList.add('table-responsive');
                       table_sqlite.className = "table table-pink table-bordered table-striped table-hover";

                       const thead_sqlite = document.createElement('thead');
                       thead_sqlite.className = "table-pink-header";

                       const headerRow_sqlite = document.createElement('tr');

                       results_sqlite[0].columns.forEach(column => {
                        const th_sqlite = document.createElement('th');

                        th_sqlite.innerText = column;
                        headerRow_sqlite.appendChild(th_sqlite);
                       });

                       thead_sqlite.appendChild(headerRow_sqlite);
                       table_sqlite.appendChild(thead_sqlite);

                       const tbody_sqlite = document.createElement('tbody');

                       results_sqlite[0].values.forEach(row => {
                        const tr_sqlite = document.createElement('tr');

                        row.forEach(value => {
                            const td_sqlite = document.createElement('td');
                            td_sqlite.innerText = value === null ? "NULL" : String(value);

                            tr_sqlite.appendChild(td_sqlite);
                        });

                        tbody_sqlite.appendChild(tr_sqlite);
                       });

                       table_sqlite.appendChild(tbody_sqlite);
                       responsiveDiv_sqlite.appendChild(table_sqlite)
                       resultsContainer2.replaceChildren(responsiveDiv_sqlite);
                    }
                }
            });

            //Вар. 3 - с модифициране и експортиране на импортирана БД--------------------------------------------------------
            let db3 = null;
            const fileInput2 = document.querySelector('#db_file_2');
            fileInput2.addEventListener('change', function () {
                const file = this.files[0];

                if (!file) {
                    return;
                }

                const reader = new FileReader();
                //what happens when reading the file finishes:
                reader.onload = function () {
                    const Uints = new Uint8Array(reader.result);
                    db3 = new SQL.Database(Uints);
                }

                //start reading the file
                reader.readAsArrayBuffer(file);
            });

            const dbErrorContainer2 = document.querySelector('#missingDbErrorContainer2');
            const sqlQueryTextarea2 = document.querySelector('#sql_query_2');
            const resultsContainer3 = document.querySelector('#results3');

            document.querySelector('#run_query_2').addEventListener('click', function () {
                if (!db3) {
                    dbErrorContainer2.innerText = "Моля, първо прикачете файл с БД!";
                    fileInput2.classList.add('is-invalid');
                } else {
                    dbErrorContainer2.innerText = "";
                    fileInput2.classList.remove('is-invalid');

                    if (sqlQueryTextarea2.value == "") {
                        dbErrorContainer2.innerText = "Моля, въведете заявка за изпълнение!";
                        sqlQueryTextarea2.classList.add('is-invalid');
                    } else {
                       resultsContainer3.classList.remove('d-none');
                       sqlQueryTextarea2.classList.remove('is-invalid');  

                       const query = sqlQueryTextarea2.value;

                        if (query) {
                            db3.exec(query);
                        }

                        const data = db3.export();
                        const blob = new Blob([data], {
                            type: "application/x-sqlite3",
                        });

                        const url = URL.createObjectURL(blob);

                        const downloadBtn = document.createElement('button');
                        const icon = document.createElement('i');

                        icon.className = "bi bi-download me-1";
                        downloadBtn.className = "btn btn-pink rounded-pill";
                        downloadBtn.append(icon, "Изтегли новата БД");

                        document.querySelector('#twoBtnsDiv').appendChild(downloadBtn);

                        downloadBtn.addEventListener('click', function () {
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = "new_modified_database.db";

                            a.click();
                            URL.revokeObjectURL(url);
                        });

                       resultsContainer3.innerText = "Заявката е успешно изпълнена! Можете да изтеглите новата БД!";
                    }
                }
            });

            //Вар. 4 - със създаване и експортиране на импортирана БД--------------------------------------------------------
            let db4 = new SQL.Database();

            const dbErrorContainer3 = document.querySelector('#missingDbErrorContainer3');
            const sqlQueryTextarea3 = document.querySelector('#sql_query_3');
            const resultsContainer4 = document.querySelector('#results4');

            document.querySelector('#run_query_3').addEventListener('click', function () {
                if (sqlQueryTextarea3.value == "") {
                     dbErrorContainer3.classList.remove('d-none');
                     dbErrorContainer3.innerText = "Моля, въведете заявка за изпълнение!";
                     sqlQueryTextarea3.classList.add('is-invalid');
                } else {
                    dbErrorContainer3.classList.add('d-none');
                    resultsContainer4.classList.remove('d-none');
                    sqlQueryTextarea3.classList.remove('is-invalid');

                    const query = sqlQueryTextarea3.value; //can be both creation of several tables + insertion of values

                    if (query) {
                        db4.run(query);
                    }

                    const data = db4.export();
                    const blob = new Blob([data], {
                        type: "application/x-sqlite3",
                    });

                    const url = URL.createObjectURL(blob);

                    const downloadBtn = document.createElement('button');
                    const icon = document.createElement('i');

                    icon.className = "bi bi-download me-1";
                    downloadBtn.className = "btn btn-pink rounded-pill";
                    downloadBtn.append(icon, "Изтегли новата БД");

                    document.querySelector('#twoBtnsDiv2').appendChild(downloadBtn);

                    downloadBtn.addEventListener('click', function () {
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = "new_created_database.db";

                        a.click();
                        URL.revokeObjectURL(url);
                    });

                    resultsContainer4.innerText = "Заявката е успешно изпълнена! Можете да изтеглите новата БД!";
                }
            });
        }

        main().catch(console.error);
});