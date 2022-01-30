// access to cloud logs 

// rowy-backend logWriter
resource "google_project_iam_member" "rowy_backend_logging_logWriter_role" {
  project  = var.project
  role     = "roles/logging.logWriter"
  member =  "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}"
  depends_on = [google_service_account.rowy_backend_serviceAccount]
}

// rowy-hooks logWriter
resource "google_project_iam_member" "rowy_hooks_logging_logWriter_role" {
  project  = var.project
  role     = "roles/logging.logWriter"
  member = "serviceAccount:${google_service_account.rowy_hooks_serviceAccount.email}"
  depends_on = [google_service_account.rowy_hooks_serviceAccount]
}
// rowy-backend logViewer
resource "google_project_iam_member" "rowy_backend_logging_viewer_role" {
  project  = var.project
  role     = "roles/logging.viewer"
  member = "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}"
  depends_on = [google_service_account.rowy_backend_serviceAccount]
}

// rowy-backend datastore user
resource "google_project_iam_member" "rowy_backend_datastore_user_role" {
  project  = var.project
  role     = "roles/datastore.user"
  member =  "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}"
  depends_on = [google_service_account.rowy_backend_serviceAccount]
}

// rowy-hooks datastore user
resource "google_project_iam_member" "rowy_hooks_datastore_user_role" {
  project  = var.project
  role     = "roles/datastore.user"
  member = "serviceAccount:${google_service_account.rowy_hooks_serviceAccount.email}"
  depends_on = [google_service_account.rowy_hooks_serviceAccount]
}


// rowy-backend storage objectAdmin
resource "google_project_iam_member" "rowy_backend_storage_objectAdmin_role" {
  project  = var.project
  role     = "roles/storage.objectAdmin"
  member =  "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}"
  depends_on = [google_service_account.rowy_backend_serviceAccount]
}

// rowy-hooks storage objectAdmin
resource "google_project_iam_member" "rowy_hooks_storage_objectAdmin_role" {
  project  = var.project
  role     = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.rowy_hooks_serviceAccount.email}"
  depends_on = [google_service_account.rowy_hooks_serviceAccount]
}


// rowy-backend serviceAccountUser
resource "google_project_iam_member" "rowy_backend_iam_serviceAccountUser_role" {
  project  = var.project
  role     ="roles/iam.serviceAccountUser"
  member = "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}"
  depends_on = [google_service_account.rowy_backend_serviceAccount]
}
// rowy-backend firebaseAdmin
resource "google_project_iam_member" "rowy_backend_firebase_admin_role" {
  project  = var.project
  role     = "roles/firebase.admin"
  member = "serviceAccount:${google_service_account.rowy_backend_serviceAccount.email}"
  depends_on = [google_service_account.rowy_backend_serviceAccount]
}
// rowy-builder editor
resource "google_project_iam_member" "rowy_builder_editor_role" {
  project  = var.project
  role     = "roles/editor"
  member = "serviceAccount:${google_service_account.rowy_builder_serviceAccount.email}"
  depends_on = [google_service_account.rowy_builder_serviceAccount] 
}

resource "google_project_iam_member" "default_service_editor_role" {
  project  = var.project
  role     = "roles/editor"
  member = "serviceAccount:${var.project}@appspot.gserviceaccount.com" 
}

resource "google_project_iam_member" "default_service_secret_accessor_role" {
  project  = var.project
  role     = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${var.project}@appspot.gserviceaccount.com" 
}