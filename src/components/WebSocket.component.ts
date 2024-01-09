import { Component, ContextTags, createBindingFromClass } from '@loopback/core';
import { WebSocketService } from '../services';
import { getExtensions } from '../extensions';

export class WebSocketComponent implements Component {
  bindings = [
    createBindingFromClass(WebSocketService, {
      [ContextTags.KEY]: WebSocketService.BINDING_KEY,
    }),
    ...getExtensions(),
  ];
}
