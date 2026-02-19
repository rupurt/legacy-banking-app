# Customer


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**customerId** | **number** |  | [optional] [default to undefined]
**firstName** | **string** |  | [optional] [default to undefined]
**lastName** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**cifNumber** | **string** |  | [optional] [default to undefined]
**dateOfBirth** | **string** |  | [optional] [default to undefined]
**kycStatus** | **string** |  | [optional] [default to undefined]
**riskRating** | **string** |  | [optional] [default to undefined]
**accountCount** | **number** |  | [optional] [default to undefined]
**accounts** | [**Array&lt;Account&gt;**](Account.md) |  | [optional] [default to undefined]

## Example

```typescript
import { Customer } from './api';

const instance: Customer = {
    customerId,
    firstName,
    lastName,
    email,
    cifNumber,
    dateOfBirth,
    kycStatus,
    riskRating,
    accountCount,
    accounts,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
