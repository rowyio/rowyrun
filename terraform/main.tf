resource "random_integer" "number" {
  min = 100
  max = 999
}

// create a cloud run service prebuilt image
// create a new service account
resource "google_service_account" "rowy_run_serviceAccount" {
  // random account id
  account_id   = "rowy-run${random_integer.number.result}"
  display_name = "Rowy Run service Account"
}
resource "google_project_iam_binding" "roles" {
  project  = var.project_id
  for_each = toset(local.required_roles)
  role     = each.key
  members = [
    "serviceAccount:${google_service_account.rowy_run_serviceAccount.email}",
  ]
  depends_on = [google_service_account.rowy_run_serviceAccount]
}
resource "google_cloud_run_service" "rowy-run" {
  name = "rowy-run"
  location = "us-central1"
  project = var.project_id
   template {
    spec {
      containers {
        image = "gcr.io/rowy-run/rowy-run:latest"
      }
      service_account_name = google_service_account.rowy_run_serviceAccount.email
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
  depends_on = [
    google_service_account.rowy_run_serviceAccount
  ]
}
output "service_account_email" {
  value       = google_service_account.rowy_run_serviceAccount.email
  description = "The created service account email"
}
