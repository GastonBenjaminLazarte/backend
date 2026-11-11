import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  it('returns the API status message', () => {
    const controller = new AppController(new AppService());
    expect(controller.getHello()).toBe('API de Comanda funcionando');
  });
});
