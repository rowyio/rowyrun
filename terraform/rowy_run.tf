// create a new service account for rowy run

// import existing cloud run service

resource "google_service_account" "rowy_run_serviceAccount" {
  // random account id
  account_id   = "rowy-run${random_integer.number.result}"
  display_name = "Rowy Run service Account"
}
// cloud run service with unauthenticated access
resource "google_cloud_run_service" "rowy_run" {
  name     = "rowy-run"
  location = var.region
  project  = var.project
  template {
    spec {
      containers {
        image = local.rowy_run_image

        ports {
          container_port = 8080
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "1Gi"
            } 
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

output "rowy_run_service_account_email" {
  value       = google_service_account.rowy_run_serviceAccount.email
  description = "The created service account email"
}
