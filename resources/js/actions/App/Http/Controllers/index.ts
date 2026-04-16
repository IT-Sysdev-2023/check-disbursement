import Auth from './Auth'
import DashboardController from './DashboardController'
import AdminController from './AdminController'
import CvController from './CvController'
import CrfController from './CrfController'
import RetrievedChecksController from './RetrievedChecksController'
import BorrowedCheckController from './BorrowedCheckController'
import ScannedRecordsController from './ScannedRecordsController'
import BankController from './BankController'
import AssignedCheckNumberController from './AssignedCheckNumberController'
import StatusController from './StatusController'
import CheckRequestController from './CheckRequestController'
import CheckReleasingController from './CheckReleasingController'
import ForwardedCheckController from './ForwardedCheckController'
import ClosingController from './ClosingController'
import ReportController from './ReportController'
import Settings from './Settings'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
DashboardController: Object.assign(DashboardController, DashboardController),
AdminController: Object.assign(AdminController, AdminController),
CvController: Object.assign(CvController, CvController),
CrfController: Object.assign(CrfController, CrfController),
RetrievedChecksController: Object.assign(RetrievedChecksController, RetrievedChecksController),
BorrowedCheckController: Object.assign(BorrowedCheckController, BorrowedCheckController),
ScannedRecordsController: Object.assign(ScannedRecordsController, ScannedRecordsController),
BankController: Object.assign(BankController, BankController),
AssignedCheckNumberController: Object.assign(AssignedCheckNumberController, AssignedCheckNumberController),
StatusController: Object.assign(StatusController, StatusController),
CheckRequestController: Object.assign(CheckRequestController, CheckRequestController),
CheckReleasingController: Object.assign(CheckReleasingController, CheckReleasingController),
ForwardedCheckController: Object.assign(ForwardedCheckController, ForwardedCheckController),
ClosingController: Object.assign(ClosingController, ClosingController),
ReportController: Object.assign(ReportController, ReportController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers