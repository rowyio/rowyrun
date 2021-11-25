locals {
  rowy_run_required_roles = [
    "roles/secretmanager.secretAccessor",
    "roles/logging.logWriter",
    "roles/logging.viewer",
    "roles/firebase.admin",
    "roles/iam.serviceAccountUser",
    "roles/datastore.user",
  ]
  rowy_hooks_required_roles = ["roles/logging.logWriter",
    "roles/datastore.user"
  ]
}
