resource "random_integer" "number" {
  min = 100
  max = 999
}

# Create app engine application if it doesnt exist
// create a cloud run service prebuilt image


// create a new service account
resource "google_service_account" "rowy_run_serviceAccount" {
  // random account id
  account_id   = "rowy-run${random_integer.number.result}"
  display_name = "Rowy Run service Account"
}
resource "google_project_iam_binding" "roles" {
  project  = var.project
  for_each = toset(local.required_roles)
  role     = each.key
  members = [
    "serviceAccount:${google_service_account.rowy_run_serviceAccount.email}",
  ]
  depends_on = [google_service_account.rowy_run_serviceAccount]
}
// cloud run service with unauthenticated access
resource "google_cloud_run_service" "rowy-run" {
  name     = "rowy-run"
  location = var.region
  project  = var.project
  template {
    spec {
      containers {
        image = "gcr.io/rowy-run/rowy-run:latest"
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
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.rowy-run.location
  project     = google_cloud_run_service.rowy-run.project
  service     = google_cloud_run_service.rowy-run.name
  policy_data = data.google_iam_policy.noauth.policy_data
}
output "rowy_run_url" {
  value       = google_cloud_run_service.rowy-run.status[0].url
  description = "Rowy Run url"
}
output "owner_email" {
  value = google_cloud_run_service.rowy-run.metadata[0].annotations["serving.knative.dev/creator"]
  description = "Owner Email"
}

output "service_account_email" {
  value       = google_service_account.rowy_run_serviceAccount.email
  description = "The created service account email"
}