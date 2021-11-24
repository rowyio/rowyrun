

# Create app engine application if it doesnt exist
// create a cloud run service prebuilt image


// create a new service account for rowy run
resource "google_service_account" "rowy_run_serviceAccount" {
  // random account id
  account_id   = "rowy-run${random_integer.number.result}"
  display_name = "Rowy Run service Account"
}
resource "google_project_iam_binding" "rowy_run_roles" {
  project  = var.project
  for_each = toset(local.rowy_run_required_roles)
  role     = each.key
  members = [
    "serviceAccount:${google_service_account.rowy_run_serviceAccount.email}",
  ]
  depends_on = [google_service_account.rowy_run_serviceAccount]
}
// cloud run service with unauthenticated access
resource "google_cloud_run_service" "rowy_run" {
  name     = "rowy-run"
  location = var.region
  project  = var.project
  template {
    spec {
      containers {
        image = "gcr.io/rowy-run/rowy-run@sha256:813ad4bef930a495665bd2a6df298d50b542f69afed56e42bf751e8837ea8ea6"
        ports {
          container_port = 8080
        }
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


resource "google_cloud_run_service_iam_policy" "rowy_run_noauth" {
  location    = google_cloud_run_service.rowy_run.location
  project     = google_cloud_run_service.rowy_run.project
  service     = google_cloud_run_service.rowy_run.name
  policy_data = data.google_iam_policy.noauth.policy_data
}
output "rowy_run_url" {
  value       = google_cloud_run_service.rowy_run.status[0].url
  description = "Rowy Run url"
}

# output "service_account_email" {
#   value       = google_service_account.rowy_run_serviceAccount.email
#   description = "The created service account email"
# }