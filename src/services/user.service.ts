import {
  BindingKey,
  /* inject, */ BindingScope,
  injectable,
} from '@loopback/core';

@injectable({scope: BindingScope.APPLICATION})
export class UserService {
  static BINDING_KEY = BindingKey.create<UserService>(
    `services.${UserService.name}`,
  );

  constructor() {}

  addNewUser(username: string) {
    console.log({username});
  }
}
