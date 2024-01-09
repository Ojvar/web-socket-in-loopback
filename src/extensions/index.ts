import { createBindingFromClass } from '@loopback/core';
import { WsAdminHandler } from './ws-admin.extension';
import { WsMainHandler } from './ws-main.extension';

export function getExtensions() {
  return [
    createBindingFromClass(WsMainHandler),
    createBindingFromClass(WsAdminHandler),
  ];
}
