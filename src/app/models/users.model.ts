export class UsersModel {
    public name!: string;
    public project!: string[];
    public id?: string;
  
    constructor(name: string, project: string[]) {
      this.name = name;
      this.project = project;
    }
  
    // toObject(): any {
    //   return {
    //     name: this.name,
    //     project: this.project
    //   };
    // }
  }
  