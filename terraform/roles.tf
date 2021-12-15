resource "google_project_iam_binding" "logging_logWriter_role" {
  project  = var.project
  role     = "roles/logging.logWriter"
  members = [
    "serviceAccount:${google_service_account.rowy_hooks_serviceAccount.email}",
    "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}",
  ]
  depends_on = [google_service_account.rowy_backend_serviceAccount,google_service_account.rowy_hooks_serviceAccount]
}

resource "google_project_iam_binding" "datastore_user_role" {
  project  = var.project
  role     = "roles/datastore.user"
  members = [
    "serviceAccount:${google_service_account.rowy_hooks_serviceAccount.email}",
    "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}",
  ]
  depends_on = [google_service_account.rowy_backend_serviceAccount,google_service_account.rowy_hooks_serviceAccount]
}

resource "google_project_iam_binding" "storage_object_admin" {
  project  = var.project
  role     = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:${google_service_account.rowy_hooks_serviceAccount.email}",
    "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}",
  ]
  depends_on = [google_service_account.rowy_backend_serviceAccount,google_service_account.rowy_hooks_serviceAccount]
}

resource "google_project_iam_binding" "storage_object_admin" {
  project  = var.project
  role     = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:${google_service_account.rowy_hooks_serviceAccount.email}",
    "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}",
  ]
  depends_on = [google_service_account.rowy_backend_serviceAccount,google_service_account.rowy_hooks_serviceAccount]
}

resource "google_project_iam_binding" "iam_serviceAccountUser_role" {
  project  = var.project
  role     ="roles/iam.serviceAccountUser"
  members = [
    "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}",
  ]
  depends_on = [google_service_account.rowy_backend_serviceAccount]
}

resource "google_project_iam_binding" "firebase_admin_role" {
  project  = var.project
  role     = "roles/firebase.admin"
  members = [
    "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}",
  ]
  depends_on = [google_service_account.rowy_backend_serviceAccount]
}

resource "google_project_iam_binding" "logging_viewer_role" {
  project  = var.project
  role     = "roles/logging.viewer"
  members = [
    "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}",
  ]
  depends_on = [google_service_account.rowy_backend_serviceAccount]
}