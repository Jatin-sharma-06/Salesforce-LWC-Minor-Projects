import { LightningElement, wire, track } from 'lwc';

import { NavigationMixin } from 'lightning/navigation';

import { getListUi } from 'lightning/uiListApi';

import ACCOUNT_OBJECT from '@salesforce/schema/Account';

import { deleteRecord } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { refreshApex } from '@salesforce/apex';

export default class AccountActionConsole extends NavigationMixin(LightningElement) {

    @track accounts = [];
    isLoading = true;

    wiredResult;

    // 🔹 Datatable Columns
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Industry', fieldName: 'Industry' },
        { label: 'Phone', fieldName: 'Phone' },
        {
            type: 'action',
            typeAttributes: { rowActions: this.getRowActions }
        }
    ];

    // 🔹 Row Actions
    getRowActions(row, doneCallback) {
        const actions = [
            { label: 'View', name: 'view' },
            { label: 'Edit', name: 'edit' },
            { label: 'Delete', name: 'delete' },
            { label: 'Open in New Tab', name: 'new_tab' }
        ];
        doneCallback(actions);
    }

    // 🔹 Fetch Accounts (UI API)
    @wire(getListUi, {
        objectApiName: ACCOUNT_OBJECT,
        listViewApiName: 'AllAccounts',
        pageSize: 20,
        fields: ['Account.Name', 'Account.Industry', 'Account.Phone']
    })
    wiredAccounts(result) {
        this.wiredResult = result;

        if (result.data) {
            this.accounts = result.data.records.records.map(record => {
                const fields = record.fields || {};

                return {
                    Id: record.id,
                    Name: fields.Name?.value ?? '',
                    Industry: fields.Industry?.value ?? '',
                    Phone: fields.Phone?.value ?? ''
                };
            });

            this.isLoading = false;
        } else if (result.error) {
            console.error(result.error);
            this.isLoading = false;
        }
    }

    // 🔹 Handle Row Action
    handleRowAction(event) {
        const action = event.detail.action.name;
        const row = event.detail.row;

        switch (action) {
            case 'view':
                this.navigateToRecord(row.Id);
                break;

            case 'edit':
                this.navigateToEdit(row.Id);
                break;

            case 'delete':
                this.deleteAccount(row.Id);
                break;

            case 'new_tab':
                this.openInNewTab(row.Id);
                break;
        }
    }

    // 🔹 Navigation - View
    navigateToRecord(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }

    // 🔹 Navigation - Edit
    navigateToEdit(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                actionName: 'edit'
            }
        });
    }

    // 🔹 Open in New Tab
    openInNewTab(recordId) {
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        }).then(url => {
            window.open(url, '_blank');
        });
    }

    // 🔹 Delete Record (LDS)
    deleteAccount(recordId) {

        if (!confirm('Are you sure you want to delete this record?')) {
            return;
        }

        this.isLoading = true;

        deleteRecord(recordId)
            .then(() => {
                this.showToast('Success', 'Record deleted', 'success');
                return refreshApex(this.wiredResult);
            })
            .catch(error => {
                this.showToast('Error', 'Delete failed', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    // 🔹 Toast Helper
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}