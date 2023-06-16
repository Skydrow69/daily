export class UsersModel{
    public name!: string;
    public project!: Array<number>;

    constructor(name:string, project:Array<number>){
        this.name = name;
        this.project = project;
    }
}