import { LightningElement, api } from 'lwc';
import syncCustomerData from '@salesforce/apex/QuickBooksSyncService.syncCustomerData';

export default class SyncBillsWithAccount extends LightningElement {
    @api recordId;

    handleSync(){
        syncCustomerData({accountId : this.recordId})   //call apex class
        .then(() => {
            alert('Sync Completed');
        })
        .catch(error => {
            console.error(error);
        });
    }

}