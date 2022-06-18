export class RegisterService {
  getRegisterSmall() {
    return fetch("./Register.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }

  getRegister() {
    return fetch("./Register.json")
      .then((res) => {
        res.json();
      })
      .then((d) => d.data);
  }

  getRegisterWithOrdersSmall() {
    return fetch("./Register.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }
}
