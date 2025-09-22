# Profile Picture Upload API Test

## Overview
This implementation provides a simple NestJS endpoint for uploading profile pictures to the Leave Management System.

## Features
- **Route**: `POST /users/:id/profile-pic`
- **File validation**: Only accepts JPG, JPEG, PNG, WEBP files up to 5MB
- **File naming**: Saves files as `user_<id>.<ext>`
- **Storage**: Files saved in `uploads/profile_pics/` directory
- **Database update**: Updates `profile_picture_url` column using raw PostgreSQL query

## Files Created/Modified

### 1. ProfilePictureService (`src/users/profile-picture.service.ts`)
- Handles file upload logic
- Validates file type and size
- Uses raw PostgreSQL queries with `pg` library
- Creates directory structure if needed

### 2. UsersController (`src/users/users.controller.ts`)
- Added new `POST /users/:id/profile-pic` endpoint
- Uses `FileInterceptor` from `@nestjs/platform-express`
- Validates file upload and calls service

### 3. UsersModule (`src/users/users.module.ts`)
- Added ProfilePictureService to providers
- Exported service for potential use in other modules

## Usage Example

```bash
# Upload a profile picture for user with ID "123e4567-e89b-12d3-a456-426614174000"
curl -X POST \
  http://localhost:3001/users/123e4567-e89b-12d3-a456-426614174000/profile-pic \
  -F "file=@profile.jpg"
```

## Response Format
```json
{
  "profilePicUrl": "/uploads/profile_pics/user_123e4567-e89b-12d3-a456-426614174000.jpg"
}
```

## Testing Steps

1. **Backend is running**: ✅ NestJS server on http://localhost:3001
2. **Frontend is running**: ✅ Express server on http://localhost:3002
3. **Route registered**: ✅ `/users/:id/profile-pic` visible in logs
4. **Directory created**: ✅ `uploads/profile_pics/` exists

## Notes
- Files are stored locally in the uploads directory
- The implementation uses basic PostgreSQL queries (no TypeORM)
- File validation is done in-memory before saving
- Original filenames are replaced with standardized naming
- CORS is enabled for frontend communication