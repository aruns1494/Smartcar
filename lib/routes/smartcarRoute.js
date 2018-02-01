module.exports = function(app, controllerPath) {
    let smartcarController = require(controllerPath);

    app.route('/vehicles/:id')
       .get(smartcarController.getVehicleInfoService);

    app.route('/vehicles/:id/doors')
       .get(smartcarController.getSecurityStatusService);

    app.route('/vehicles/:id/fuel')
       .get(smartcarController.getFuelLevel);

    app.route('/vehicles/:id/battery')
       .get(smartcarController.getBatteryLevel);

    app.route('/vehicles/:id/engine')
       .post(smartcarController.executingEngineActionService);
}
