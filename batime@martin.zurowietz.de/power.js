const { GObject} = imports.gi;
const UPower = imports.gi.UPowerGlib;
const BaseIndicator = imports.ui.status.power.Indicator;

var Indicator = GObject.registerClass(
   class Indicator extends BaseIndicator {
   // Adapted from _getStatus of the parent.
   _getTime() {
      let seconds = 0;

      if (this._proxy.State === UPower.DeviceState.FULLY_CHARGED) {
         return '';
      } else if (this._proxy.State === UPower.DeviceState.CHARGING) {
         seconds = this._proxy.TimeToFull;
      } else if (this._proxy.State === UPower.DeviceState.DISCHARGING) {
         seconds = this._proxy.TimeToEmpty;
      } else if (this._proxy.State === UPower.DeviceState.PENDING_CHARGE) {
         return '';
      } else {
         // state is PENDING_DISCHARGE or UNKNOWN
         return _('Estimating…');
      }

      let time = Math.round(seconds / 60);
      if (time === 0) {
         // 0 is reported when UPower does not have enough data
         // to estimate battery life
         return _('Estimating…');
      }

      let minutes = time % 60;
      let hours = Math.floor(time / 60);

      // Translators: this is <hours>:<minutes>
      return _('%d\u2236%02d').format(hours, minutes);
   }

   _sync() {
      super._sync();
      this._percentageLabel.text = this._getTime();
   }
});
