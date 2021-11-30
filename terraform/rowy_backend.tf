// create a new service account for rowy run

// import existing cloud run service

resource "google_service_account" "rowy_backend_serviceAccount" {
  // random account id
  account_id   = "rowy-backend${random_integer.number.result}"
  display_name = "Rowy Backend service Account"
}
// cloud run service with unauthenticated access
resource "google_cloud_run_service" "rowy_backend" {
  name     = "rowy-backend"
  location = var.region
  project  = var.project
  template {
    spec {
      containers {
        image = local.rowy_backend_image

        ports {
          container_port = 8080
        }
        resources {
          limits = {
            cpu    = "2000m"
            memory = "2Gi"
            } 
        }
      }
      service_account_name = google_service_account.rowy_backend_serviceAccount.email
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [
    google_service_account.rowy_backend_serviceAccount
  ]
}


resource "google_cloud_run_service_iam_policy" "rowy_backend_noauth" {
  location    = google_cloud_run_service.rowy_backend.location
  project     = google_cloud_run_service.rowy_backend.project
  service     = google_cloud_run_service.rowy_backend.name
  policy_data = data.google_iam_policy.noauth.policy_data
}
output "rowy_backend_url" {
  value       = google_cloud_run_service.rowy_backend.status[0].url
  description = "Rowy Backend url"
}

output "rowy_backend_service_account_email" {
  value       = google_service_account.rowy_backend_serviceAccount.email
  description = "The created service account email"
}
