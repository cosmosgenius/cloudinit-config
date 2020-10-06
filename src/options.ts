interface UserInterface {
  ghusername?: string
  ssh_authorized_keys?: Array<string>
}

export class CloudInitOptions {
  constructor(readonly users: Array<User>) {}
}

export class User {
  constructor(
    readonly username: string,
    readonly options: UserInterface = {}
  ) {}

  get ghusername() {
    return this.options.ghusername || '';
  }

  get ssh_authorized_keys() {
    return this.options.ssh_authorized_keys || [];
  }
}

export class Users extends Array<User> {
  static fromENV() {
    if(self.USERS) {
      try {
        const jsonstr = self.atob(self.USERS);
        const usersArr = JSON.parse(jsonstr);
        if(Array.isArray(usersArr) && usersArr.length) {
          return usersArr.map((u:any) => {
            const userObj = u || {};
            let ssh_authorized_keys = userObj.ssh_authorized_keys;
            if(!Array.isArray(ssh_authorized_keys)) {
              ssh_authorized_keys = [];
            }

            return new User(userObj.username, {
              ghusername: userObj.ghusername,
              ssh_authorized_keys: ssh_authorized_keys
            });
          })
        }
      } catch {
        // pass throug
      }
      return new Users(...[]);
    }

    return new Users(...[]);
  }
}
