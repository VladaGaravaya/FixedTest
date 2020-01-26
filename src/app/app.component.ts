import { Component }  from '@angular/core';
 
@Component({
    selector: 'app',
    template: `<textarea [(ngModel)]="data"></textarea>
    <br>
    <button class="btn btn-default" (click)="loading(data)">Продолжить</button>
    <div class="panel" [style.visibility]="items ? 'visible' : 'hidden'">
        <div class="form-inline">
            <div class="form-group">
                <button class="btn btn-default" (click)="addItem(text, year)">Добавить запись</button>
            </div>
        </div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th *ngFor="let col of columns">{{col}}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let item of items">
                    <td *ngFor="let col of columns" (click)="changeItem(item, col)">{{item[col]}}</td>
                    <td class="delete"> 
                        <button class="btn btn-default" id="delete" (click)="deleteItem(item)">Удалить</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <textarea id="unload"></textarea>
    <br>
    <button class="btn btn-default" (click)="unloading()">Выгрузить</button>`,
    styles: [`
        button, textarea, table {margin: 10px;}
        textarea, table, .form-inline {width: 540px;}
        .delete {width: 100px;}
        #delete {margin: 2px;}
        td:hover {cursor: pointer;}
    `]
})

export class AppComponent { 

    items: object[];
    columns: string[];

    addItem(): void {

        let newItem: object = {};
         
        this.columns.forEach(col => {
            let newData = prompt(`Input ${col}`);
            newItem[col] = newData;
        });

        this.items.push(newItem);
    }

    deleteItem(item: object): void {

        let index;

        this.items.forEach(element => {
            if(JSON.stringify(element)===JSON.stringify(item)) {
                index = this.items.indexOf(element);
            }
        });

        this.items.splice(index, 1);
    }

    changeItem(item: object, col: string): void {
        
        this.items.forEach(element => {
            if(JSON.stringify(element)===JSON.stringify(item)) {
                let newData = prompt(`Input new ${col}.`);
                if(newData !=="" || newData.trim() !=="") {
                    element[col] = newData;
                }
                else {
                    alert("Error. Input data again.");
                }
            }
        });
    }

    loading(data: string) {

        let correctJson = data.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
        let items = JSON.parse(correctJson);
        let col: string[];
        let error: boolean;

        items.forEach((element: any) => {
            if(typeof col === "undefined") {
                col = Object.keys(element);   
            }
            if(JSON.stringify(col) != JSON.stringify(Object.keys(element))){
                alert("Input uncorrect JSON.");
                error  = true;
            }
        });

        if(!error) {
            this.columns = col;
            this.items = items;
        }
    }

    unloading() {

        let unloadData: string[] = [];
        let elem: string[] = [];

        this.items.forEach(element => {
            this.columns.forEach(col => {
                elem.push(`${col}:"${element[col]}"`);
            });
            unloadData.push('{'+elem.join(',')+'}') ;
            elem = [];
        });

        document.getElementById("unload").innerText = `[${unloadData.join(",")}]`;
    }
}
