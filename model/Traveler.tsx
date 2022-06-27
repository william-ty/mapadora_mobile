export class Traveler {
    static routeName = "traveler";
  
    id?: number;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
   
  
    constructor({
      id,
      email = "",
      password = "",
      firstname = "",
      lastname = ""
     
    } : {
      id:number,
      email : string,
      password : string,
      firstname : string,
      lastname : string
    }) {
      this.id = id;
      this.email = email;
      this.password = password;
      this.firstname = firstname;
      this.lastname = lastname;

    }
  }
  