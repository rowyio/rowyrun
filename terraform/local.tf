locals {
  rowy_run_required_roles = ["roles/logging.logWriter",
    "roles/logging.viewer",
    "roles/firebase.admin",
  "roles/iam.serviceAccountUser"]
  rowy_hooks_required_roles = ["roles/logging.logWriter",
    "roles/datastore.user"
    ]
}
