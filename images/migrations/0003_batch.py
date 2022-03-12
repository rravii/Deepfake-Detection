# Generated by Django 4.0.2 on 2022-03-12 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('images', '0002_alter_images_percent_alter_images_result'),
    ]

    operations = [
        migrations.CreateModel(
            name='Batch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number_of_faces', models.IntegerField(default=0)),
                ('number_of_processed_faces', models.IntegerField(default=0)),
                ('faces_path', models.TextField(blank=True)),
                ('status', models.IntegerField(default=0)),
                ('completed', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]